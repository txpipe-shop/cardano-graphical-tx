use std::collections::HashMap;

use crate::{
  compute_datum_hashmap, Assets, CborResponse, Certificates, Datum as DatumInfo, InputUtxo,
  MetadataItem, OutputUtxo, WithdrawalItem,
};

use pallas::{
  codec::utils::KeepRaw,
  crypto::hash::Hasher,
  ledger::{
    primitives::{conway::PlutusData, ToCanonicalJson},
    traverse::{ComputeHash, MultiEraTx},
  },
};
use pallas_codec::utils::KeyValuePairs;
use pallas_primitives::{
  conway::{DatumHash, Metadatum, PseudoDatumOption},
  Fragment,
};

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

    let mints: Vec<Assets> = tx
      .mints()
      .iter()
      .map(|mint| {
        let policy = mint.policy().to_string();
        let asset_name = mint
          .assets()
          .iter()
          .map(|x| hex::encode(x.name()))
          .collect();
        let quantity = mint
          .assets()
          .iter()
          .map(|x| {
            x.mint_coin()
              .map_or_else(|| "None".to_string(), |value| value.to_string())
          })
          .collect();

        Assets {
          policy_id: policy,
          asset_name,
          quantity,
        }
      })
      .collect();

    let tx_copy = tx.clone();
    let datum_hashmap = compute_datum_hashmap(tx_copy);

    let outputs: Vec<OutputUtxo> = tx
      .outputs()
      .iter()
      .enumerate()
      .map(|(index, o)| {
        let lovelace = o.lovelace_amount();
        let other_assets: Vec<Assets> = o
          .non_ada_assets()
          .iter()
          .flat_map(|x| {
            let policy = x.policy().to_string();
            let parsed_assets: Vec<Assets> = x
              .assets()
              .iter()
              .map(|asset| {
                let asset_name = hex::encode(asset.name());
                let quantity = match asset.output_coin() {
                  Some(value) => value.to_string(),
                  None => String::from("None"),
                };
                Assets {
                  policy_id: policy.clone(),
                  asset_name,
                  quantity,
                }
              })
              .collect();
            parsed_assets
          })
          .collect();

        let mut assets: Vec<Assets> = other_assets;
        assets.push(Assets {
          policy_id: "".to_string(),
          asset_name: "lovelace".to_string(),
          quantity: lovelace.to_string(),
        });

        let datum_info = get_datum_info(&o.datum(), &datum_hashmap);
        OutputUtxo {
          tx_hash: tx.hash().to_string(),
          index: index.to_string(),
          address: o.address().unwrap().to_string(),
          assets,
          datum: datum_info,
          script_ref: o
            .script_ref()
            .map(|x| x.encode_fragment().ok().map(hex::encode))
            .flatten(),
        }
      })
      .collect();

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

fn get_datum_info(
  datum: &Option<PseudoDatumOption<KeepRaw<'_, PlutusData>>>,
  datum_hashmap: &HashMap<DatumHash, DatumInfo>,
) -> Option<DatumInfo> {
  match datum {
    Some(pseudo_hash) => match pseudo_hash {
      PseudoDatumOption::Hash(hash) => Some(datum_hashmap.get(&hash).unwrap().clone()),
      PseudoDatumOption::Data(hash) => Some(DatumInfo {
        hash: hash.compute_hash().to_string(),
        json: hash.to_json().to_string(),
        bytes: hex::encode(hash.raw_cbor()),
      }),
    },
    None => None,
  }
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
