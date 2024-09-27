use std::collections::HashMap;

use crate::{
  Asset, Assets, CborResponse, Certificates, Datum as DatumInfo, Datum, InputUtxo, MetadataItem,
  OutputUtxo, WithdrawalItem,
};

use pallas::{
  crypto::hash::Hasher,
  ledger::{
    primitives::{conway::PlutusData, ToCanonicalJson},
    traverse::{ComputeHash, MultiEraTx},
  },
};
use pallas_codec::utils::KeyValuePairs;
use pallas_primitives::{conway::Metadatum, Fragment};

fn metadatum_to_string(metadatum: &Metadatum) -> String {
  match metadatum {
    Metadatum::Text(text) => text.clone(),
    Metadatum::Int(int) => int.to_string(),
    Metadatum::Bytes(bytes) => String::from_utf8(bytes.to_vec()).unwrap(),
    Metadatum::Array(arr) => arr
      .iter()
      .map(metadatum_to_string)
      .collect::<Vec<_>>()
      .join(", "), // REVIEW: Should we use a different separator?
    Metadatum::Map(map) => map
      .iter()
      .map(|(key, value)| {
        format!(
          "{}: {}",
          metadatum_to_string(key),
          metadatum_to_string(value)
        )
      })
      .collect::<Vec<_>>()
      .join(", "),
  }
}

fn map_to_hashmap(map: &KeyValuePairs<Metadatum, Metadatum>) -> HashMap<String, String> {
  map
    .iter()
    .filter_map(|(key, value)| {
      if let Metadatum::Text(key_str) = key {
        let value_str = metadatum_to_string(value);
        Some((key_str.clone(), value_str))
      } else {
        // Ignore non-text keys
        None
      }
    })
    .collect()
}

fn get_outputs(tx: &MultiEraTx<'_>) -> Vec<OutputUtxo> {
  tx.outputs()
    .iter()
    .enumerate()
    .map(|(index, o)| OutputUtxo {
      tx_hash: tx.hash().to_string(),
      index: index as i64,
      bytes: hex::encode(o.encode()),
      address: o.address().unwrap().to_string(),
      lovelace: o.lovelace_amount() as i64,
      datum: o.datum().map(|x| match x {
        pallas::ledger::primitives::conway::PseudoDatumOption::Hash(x) => Datum {
          hash: x.to_string(),
          bytes: "".to_string(),
          json: "".to_string(),
        },
        pallas::ledger::primitives::conway::PseudoDatumOption::Data(x) => Datum {
          hash: x.compute_hash().to_string(),
          bytes: hex::encode(x.raw_cbor()),
          json: serde_json::to_string(&x.to_json()).unwrap(),
        },
      }),
      script_ref: o
        .script_ref()
        .map(|x| x.encode_fragment().ok().map(hex::encode))
        .flatten(),
      assets: o
        .non_ada_assets()
        .into_iter()
        .map(|x| {
          let policy_id = x.policy().to_string();
          let assets_policy = x
            .assets()
            .iter()
            .map(|asset| {
              let asset_name = hex::encode(asset.name());
              let asset_name_ascii = asset.to_ascii_name();
              let coint = match asset.output_coin() {
                Some(c) => Some(c as i64),
                None => None,
              };
              Asset {
                asset_name,
                asset_name_ascii,
                coint,
              }
            })
            .collect();
          Assets {
            policy_id,
            assets_policy,
          }
        })
        .collect(),
    })
    .collect()
}

fn get_mints(tx: &MultiEraTx<'_>) -> Vec<Assets> {
  tx.mints()
    .into_iter()
    .map(|x| Assets {
      policy_id: x.policy().to_string(),
      assets_policy: x
        .assets()
        .into_iter()
        .map(|asset| Asset {
          asset_name: hex::encode(asset.name()),
          asset_name_ascii: asset.to_ascii_name(),
          coint: asset.mint_coin(),
        })
        .collect(),
    })
    .collect()
}

pub fn new_parse(raw: String) -> Result<CborResponse, CborResponse> {
  let out = CborResponse::new().try_build(|| {
    let cbor = hex::decode(raw)?;
    let tx = MultiEraTx::decode(&cbor)?;

    let inputs: Vec<InputUtxo> = tx
      .inputs()
      .iter()
      .map(|i| InputUtxo {
        tx_hash: i.hash().to_string(),
        index: i.index().to_string(),
      })
      .collect();

    let reference_inputs: Vec<InputUtxo> = tx
      .reference_inputs()
      .iter()
      .map(|i| InputUtxo {
        tx_hash: i.hash().to_string(),
        index: i.index().to_string(),
      })
      .collect();

    let mints: Vec<Assets> = get_mints(&tx);

    let outputs: Vec<OutputUtxo> = get_outputs(&tx);
    let metadata: Vec<MetadataItem> = match tx.metadata().as_alonzo() {
      Some(metadata) => metadata
        .iter()
        .map(|(k, v)| {
          let label_str = format!("{:?}", k);
          let json_metadata = match v {
            Metadatum::Map(map) => map_to_hashmap(map),
            _ => {
              let json_value = serde_json::to_value(v).expect("Failed to convert to JSON");
              let json_string =
                serde_json::to_string(&json_value).expect("Failed to serialize JSON");
              let mut hashmap = HashMap::new();
              hashmap.insert("value".to_string(), json_string);
              hashmap
            }
          };

          MetadataItem {
            label: label_str,
            json_metadata,
          }
        })
        .collect(),
      None => vec![],
    };

    let withdrawals: Vec<WithdrawalItem> = match tx.withdrawals().as_alonzo() {
      Some(withdrawals) => withdrawals
        .iter()
        .map(|(k, v)| {
          // TODO - parse address into bech32
          WithdrawalItem {
            raw_address: k.to_string(),
            amount: v.to_string(),
          }
        })
        .collect(),
      None => vec![],
    };

    let certs: Vec<Certificates> = tx
      .certs()
      .iter()
      .map(|cert| match cert {
        pallas::ledger::traverse::MultiEraCert::NotApplicable => Certificates {
          json: "Not applicable".to_string(),
        },
        pallas::ledger::traverse::MultiEraCert::AlonzoCompatible(cow) => Certificates {
          json: serde_json::to_string(&cow).unwrap(),
        },
        pallas::ledger::traverse::MultiEraCert::Conway(cow) => Certificates {
          json: serde_json::to_string(&cow).unwrap(),
        },
        _ => Certificates {
          json: "Not implemented".to_string(),
        },
      })
      .collect();

    let parsed_cbor = CborResponse::new().with_cbor_attr(
      tx,
      inputs,
      reference_inputs,
      outputs,
      mints,
      metadata,
      withdrawals,
      certs,
    );

    Ok(parsed_cbor)
  });

  Ok(out)
}

pub fn parse_datum_info(raw: String) -> Option<DatumInfo> {
  let cbor = hex::decode(raw.clone()).ok()?;
  let data = PlutusData::decode_fragment(&cbor).ok()?;

  Some(DatumInfo {
    hash: Hasher::<256>::hash(&cbor).to_string(),
    json: data.to_json().to_string(),
    bytes: raw.clone(),
  })
}
