use std::borrow::Cow;
use std::collections::HashMap;
use std::fmt;
use std::str::FromStr;

use pallas::ledger::traverse::{Era, MultiEraInput, MultiEraOutput};
use pallas::ledger::validate::utils::UTxOs;
use pallas_crypto::hash::Hash;
use pallas_primitives::alonzo::TransactionInput;

use crate::Utxo;

const CONWAY_ERA_ORDER: &[Era] = &[Era::Conway, Era::Babbage, Era::Alonzo];
const BABBAGE_ERA_ORDER: &[Era] = &[Era::Babbage, Era::Alonzo];
const ALONZO_ERA_ORDER: &[Era] = &[Era::Alonzo];

#[derive(Debug)]
pub enum UtxoError {
  DecodeBytes(hex::FromHexError),
  InvalidTxHash(String),
  DecodeOutput { tx_hash: String, index: i64 },
}

impl fmt::Display for UtxoError {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      UtxoError::DecodeBytes(e) => write!(f, "Failed to decode utxo bytes hex: {}", e),
      UtxoError::InvalidTxHash(tx_hash) => write!(f, "Invalid tx hash: {}", tx_hash),
      UtxoError::DecodeOutput { tx_hash, index } => {
        write!(f, "Failed to decode UTxO {}#{}", tx_hash, index)
      }
    }
  }
}

impl std::error::Error for UtxoError {}

fn decode_order(era: &Era) -> &'static [Era] {
  match era {
    Era::Conway => CONWAY_ERA_ORDER,
    Era::Babbage => BABBAGE_ERA_ORDER,
    Era::Alonzo => ALONZO_ERA_ORDER,
    _ => CONWAY_ERA_ORDER,
  }
}

fn decode_output<'a>(eras: &[Era], cbor: &'a [u8]) -> Option<MultiEraOutput<'a>> {
  eras
    .iter()
    .find_map(|try_era| MultiEraOutput::decode(*try_era, cbor).ok())
}

pub fn build_utxos_for_era<'a>(
  era: &Era,
  utxos: &[Utxo],
  cbor_list: &'a mut Vec<Vec<u8>>,
) -> Result<UTxOs<'a>, UtxoError> {
  let decode_eras = decode_order(era);

  cbor_list.clear();
  for utxo in utxos {
    let cbor = hex::decode(&utxo.bytes).map_err(UtxoError::DecodeBytes)?;
    cbor_list.push(cbor);
  }

  let mut map: UTxOs = HashMap::new();

  for (utxo, cbor) in utxos.iter().zip(cbor_list.iter()) {
    let tx_hash = Hash::<32>::from_str(&utxo.tx_hash)
      .map_err(|_| UtxoError::InvalidTxHash(utxo.tx_hash.clone()))?;
    let multi_era_in = MultiEraInput::AlonzoCompatible(Box::new(Cow::Owned(TransactionInput {
      transaction_id: tx_hash,
      index: utxo.index as u64,
    })));

    let out = decode_output(decode_eras, cbor).ok_or_else(|| UtxoError::DecodeOutput {
      tx_hash: utxo.tx_hash.clone(),
      index: utxo.index,
    })?;

    map.insert(multi_era_in, out);
  }

  Ok(map)
}
