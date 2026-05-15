use std::collections::HashMap;
use std::str::FromStr;

use pallas::ledger::traverse::{Era, MultiEraInput, MultiEraOutput};
use pallas::ledger::validate::utils::UTxOs;
use pallas_crypto::hash::Hash;
use pallas_primitives::alonzo::TransactionInput;

use crate::Utxo;

const CONWAY_ERA_ORDER: &[Era] = &[Era::Conway, Era::Babbage, Era::Alonzo];
const BABBAGE_ERA_ORDER: &[Era] = &[Era::Babbage, Era::Alonzo];
const ALONZO_ERA_ORDER: &[Era] = &[Era::Alonzo];

pub fn build_utxos_for_era<'a>(
  era: &Era,
  utxos: &[Utxo],
  cbor_list: &'a mut Vec<Vec<u8>>,
) -> Result<UTxOs<'a>, String> {
  for utxo in utxos {
    let cbor =
      hex::decode(&utxo.bytes).map_err(|e| format!("Failed to decode utxo bytes hex: {}", e))?;
    cbor_list.push(cbor);
  }

  let mut map: UTxOs = HashMap::new();

  for (utxo, cbor) in utxos.iter().zip(cbor_list.iter()) {
    let tx_hash = Hash::<32>::from_str(&utxo.tx_hash)
      .map_err(|_| format!("Invalid tx hash: {}", utxo.tx_hash))?;
    let multi_era_in =
      MultiEraInput::AlonzoCompatible(Box::new(std::borrow::Cow::Owned(TransactionInput {
        transaction_id: tx_hash,
        index: utxo.index as u64,
      })));

    let decode_eras = match era {
      Era::Conway => CONWAY_ERA_ORDER,
      Era::Babbage => BABBAGE_ERA_ORDER,
      Era::Alonzo => ALONZO_ERA_ORDER,
      _ => CONWAY_ERA_ORDER,
    };

    let mut decoded = false;
    for try_era in decode_eras {
      if let Ok(out) = MultiEraOutput::decode(*try_era, cbor) {
        map.insert(multi_era_in.clone(), out);
        decoded = true;
        break;
      }
    }

    if !decoded {
      return Err(format!(
        "Failed to decode UTxO {}#{}",
        utxo.tx_hash, utxo.index
      ));
    }
  }

  Ok(map)
}
