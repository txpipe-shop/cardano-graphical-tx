use crate::constants::{FIXED_HASH, FIXED_POLICY};
use pallas_codec::minicbor::encode;
use pallas_crypto::hash::Hash;
use pallas_primitives::alonzo::{BoundedBytes, PostAlonzoAuxiliaryData, Value as AlonzoValue};
use pallas_primitives::conway::{
  AuxiliaryData, Coin, ExUnits as CExUnits, Multiasset, PostAlonzoTransactionOutput, RedeemersKey,
  RedeemersValue, RewardAccount, Tx, WitnessSet,
};
use serde_json::{json, Value};
use std::collections::HashSet;
use std::str::FromStr;
use std::{fs, path::Path};

use pallas::ledger::primitives::conway::PlutusData;
use pallas_codec::utils::{Bytes, KeyValuePairs, NonEmptyKeyValuePairs, NonZeroInt, Nullable, Set};
use pallas_primitives::conway::{
  AssetName, Metadatum, PseudoTransactionBody, RedeemerTag as RedeemerTagConway, TransactionInput,
  TransactionOutput,
};

pub fn parse_dsl(raw: String) -> String {
  let schema_path = Path::new("docs/schema.json").canonicalize().unwrap();
  let schema_content = fs::read_to_string(schema_path).unwrap();
  let schema: Value = serde_json::from_str(&schema_content).unwrap();

  let res: Value = match serde_json::from_str(&raw) {
    Ok(json) => json,
    Err(_) => return json!({ "error": "Input is not a valid JSON." }).to_string(),
  };

  let validator = jsonschema::validator_for(&schema).unwrap();
  let result = validator.validate(&res);

  match result {
    Ok(_) => json!({"cbor_hex": dsl_to_cbor_hex(raw).to_vec()}).to_string(),
    Err(e) => json!(
      {
        "error": e.to_string(),
        "instance_path": e.instance_path.to_string(),
      }
    )
    .to_string(),
  }
}

pub fn dsl_to_tx(raw: String) -> Tx {
  fn preprocess_json(raw: &str) -> Result<Value, serde_json::Error> {
    let mut res: Value = serde_json::from_str(raw)?;

    if let Some(inputs) = res["transaction"]["inputs"].as_array_mut() {
      let mut used_indices: HashSet<u64> = inputs
        .iter()
        .filter_map(|input| input["index"].as_u64())
        .collect();

      let mut next_index = *used_indices.iter().max().unwrap_or(&0) + 1;

      for input in inputs.iter_mut() {
        if input["txHash"].is_null() {
          input["txHash"] = json!(FIXED_HASH);
        }

        if input["index"].is_null() {
          while used_indices.contains(&next_index) {
            next_index += 1;
          }
          input["index"] = json!(next_index);
          used_indices.insert(next_index);
        }
      }

      inputs.sort_by(|a, b| {
        let tx_hash_a = a["txHash"].as_str().unwrap_or_default();
        let tx_hash_b = b["txHash"].as_str().unwrap_or_default();

        let index_a = a["index"].as_u64().unwrap_or_default();
        let index_b = b["index"].as_u64().unwrap_or_default();

        tx_hash_a.cmp(tx_hash_b).then(index_a.cmp(&index_b))
      });
    }

    Ok(res)
  }
  let res: Value = preprocess_json(&raw).unwrap();

  let mut redeemers_vec: Vec<(RedeemersKey, RedeemersValue)> = vec![];

  let inputs = Set::from(
    res["transaction"]["inputs"]
      .as_array()
      .unwrap_or(&vec![])
      .iter()
      .map(|x| {
        if let Some(redeemer) = x["redeemer"].as_object() {
          let tag = RedeemerTagConway::Spend;
          let index = x["index"].as_u64().unwrap() as u32;

          let mut data_vec: Vec<(PlutusData, PlutusData)> = vec![];
          for (key, value) in redeemer.iter() {
            // REVIEW: Should we use a different key encoding?
            data_vec.push((
              PlutusData::BoundedBytes(BoundedBytes::from(key.as_bytes().to_vec())),
              PlutusData::BoundedBytes(BoundedBytes::from(value.to_string().as_bytes().to_vec())),
            ))
          }

          let data_pairs: KeyValuePairs<PlutusData, PlutusData> = KeyValuePairs::from(data_vec);
          let data = PlutusData::Map(data_pairs);
          let ex_units = CExUnits { mem: 0, steps: 0 };

          let key = RedeemersKey { tag, index };
          let value = RedeemersValue { data, ex_units };

          redeemers_vec.push((key, value));
        }

        TransactionInput {
          transaction_id: {
            let tx_hash_value = x["txHash"].as_str().unwrap();
            let bytes = hex::decode(tx_hash_value).unwrap();
            let array: [u8; 32] = bytes.try_into().unwrap();
            Hash::<32>::new(array)
          },
          index: x["index"].as_u64().unwrap(),
        }
      })
      .collect::<Vec<TransactionInput>>(),
  );

  let redeemers = NonEmptyKeyValuePairs::try_from(redeemers_vec).unwrap();

  let mut mint: Option<Multiasset<NonZeroInt>> = None;
  let mut mint_kv_pairs: Vec<(Hash<28>, NonEmptyKeyValuePairs<Bytes, NonZeroInt>)> = vec![];
  let outputs = res["transaction"]["outputs"]
    .as_array()
    .unwrap_or(&vec![])
    .iter()
    .map(|x| {
      let address = x["address"].as_str().unwrap_or("").to_string().into_bytes();

      let values = {
        let values_array = x["values"].as_array().unwrap();
        let mut lovelace_am = 0;
        let mut policy_hash: Option<Hash<28>> = None;
        if values_array.len() > 1 {
          let transformed_assets: Vec<(Hash<28>, KeyValuePairs<Bytes, u64>)> = values_array
            .iter()
            .filter_map(|asset| {
              let asset_name: Vec<u8>;
              let amount = asset["amount"].as_u64().unwrap();
              if asset["assetClass"].is_null() {
                asset_name = asset["name"].as_str().unwrap().as_bytes().to_vec();
                if asset["name"].as_str().unwrap() == "lovelace".to_string() {
                  lovelace_am += amount;
                } else {
                  policy_hash = FIXED_POLICY;
                }
              } else {
                asset_name = hex::decode(&asset["assetClass"].as_str().unwrap()[57..]).unwrap();
                policy_hash = Hash::<28>::from_str(&asset["assetClass"].as_str()?[..56]).ok();
              }

              let kv_pairs = KeyValuePairs::from(vec![(Bytes::from(asset_name.clone()), amount)]);
              match policy_hash {
                Some(hash) => {
                  if !asset["minted"].is_null() {
                    let am: NonZeroInt = TryFrom::try_from(amount as i64).unwrap();
                    let pairs =
                      NonEmptyKeyValuePairs::Def(vec![(AssetName::from(asset_name.clone()), am)]);
                    mint_kv_pairs.push((hash, pairs));
                  }
                  Some((hash, kv_pairs))
                }
                None => None,
              }
            })
            .collect();
          AlonzoValue::Multiasset(lovelace_am, KeyValuePairs::from(transformed_assets))
        } else {
          AlonzoValue::Coin(values_array[0]["amount"].as_u64().unwrap())
        }
      };
      TransactionOutput::PostAlonzo(PostAlonzoTransactionOutput {
        address: address.into(),
        value: values,
        datum_option: None,
        script_ref: None,
      })
    })
    .collect::<Vec<TransactionOutput>>();
  if !mint_kv_pairs.is_empty() {
    mint = Some(NonEmptyKeyValuePairs::Def(mint_kv_pairs));
  } else if !res["transaction"]["minting"].is_null() {
    mint = res["transaction"]["minting"].as_array().map(|mint| {
      let mut mint_kv_pairs: Vec<(Hash<28>, NonEmptyKeyValuePairs<Bytes, NonZeroInt>)> = vec![];

      let mut policy_hash: Option<Hash<28>> = None;
      for asset in mint.iter() {
        let asset_name: Vec<u8>;
        if asset["assetClass"].is_null() {
          asset_name = asset["name"].as_str().unwrap().as_bytes().to_vec();
          policy_hash = FIXED_POLICY;
        } else {
          asset_name = hex::decode(&asset["assetClass"].as_str().unwrap()[57..]).unwrap();
          policy_hash = Hash::<28>::from_str(&asset["assetClass"].as_str().unwrap()[..56]).ok();
        }

        let amount = asset["amount"].as_u64().unwrap();
        let am: NonZeroInt = TryFrom::try_from(amount as i64).unwrap();
        let pairs = NonEmptyKeyValuePairs::Def(vec![(AssetName::from(asset_name), am)]);
        mint_kv_pairs.push((policy_hash.unwrap(), pairs))
      }

      Multiasset::Def(mint_kv_pairs)
    });
  }

  let withdrawals: Option<KeyValuePairs<RewardAccount, Coin>> =
    Some(KeyValuePairs::from(Vec::from(
      res["transaction"]["withdrawals"]
        .as_array()
        .unwrap_or(&vec![])
        .iter()
        .filter_map(|entry| {
          let raw_address = entry["raw_address"].as_str()?;
          let amount = entry["amount"].as_u64()?;

          let address_bytes = raw_address.as_bytes().to_vec();
          let reward_account = Bytes::from(address_bytes);

          Some((reward_account, amount))
        })
        .collect::<Vec<(RewardAccount, Coin)>>(),
    )));

  let metadata = {
    Some(KeyValuePairs::from(
      res["transaction"]["metadata"]
        .as_array()
        .unwrap_or(&vec![])
        .iter()
        .filter_map(|entry| {
          let label = entry["label"].as_u64()?;
          let json_metadata = entry["json_metadata"].as_object()?;
          let mut map_vec: Vec<(Metadatum, Metadatum)> = vec![];
          for (key, value) in json_metadata.iter() {
            let metadatum = match serde_json::from_value::<serde_json::Value>(value.clone()) {
              Ok(serde_json::Value::String(s)) => Metadatum::Text(s),
              Ok(serde_json::Value::Number(n)) => {
                if let Some(i) = n.as_i64() {
                  Metadatum::Int(i.into())
                } else {
                  Metadatum::Text(n.to_string())
                }
              }
              Ok(serde_json::Value::Array(arr)) => Metadatum::Array(
                arr
                  .into_iter()
                  .filter_map(|v| serde_json::to_string(&v).ok().map(Metadatum::Text))
                  .collect(),
              ),
              Ok(serde_json::Value::Object(obj)) => Metadatum::Map(
                obj
                  .into_iter()
                  .filter_map(|(k, v)| {
                    serde_json::to_string(&v)
                      .ok()
                      .map(|vs| (Metadatum::Text(k), Metadatum::Text(vs)))
                  })
                  .collect::<Vec<_>>()
                  .into(),
              ),
              _ => Metadatum::Text(value.to_string()),
            };

            map_vec.push((Metadatum::Text(key.clone()), metadatum));
          }

          Some((label, Metadatum::Map(map_vec.into())))
        })
        .collect::<Vec<(u64, Metadatum)>>(),
    ))
  };

  let auxiliary_data: Nullable<AuxiliaryData> =
    Some(AuxiliaryData::PostAlonzo(PostAlonzoAuxiliaryData {
      metadata,
      native_scripts: None,
      plutus_scripts: None,
    }))
    .into();

  let transaction_body = PseudoTransactionBody::<TransactionOutput> {
    inputs,
    outputs,
    fee: match res["transaction"]["fee"].as_i64() {
      Some(fee) => fee as u64,
      None => 0,
    },
    ttl: res["transaction"]["ttl"].as_u64(),
    withdrawals,
    validity_interval_start: res["transaction"]["start"].as_u64(),
    mint,
    auxiliary_data_hash: None,
    certificates: None,
    script_data_hash: None,
    collateral: None,
    required_signers: None,
    network_id: None,
    collateral_return: None,
    total_collateral: None,
    reference_inputs: None,
    // -- NEW IN CONWAY
    voting_procedures: None,
    proposal_procedures: None,
    treasury_value: None,
    donation: None,
  };

  Tx {
    transaction_body: transaction_body.clone(),
    transaction_witness_set: WitnessSet {
      vkeywitness: None,
      native_script: None,
      bootstrap_witness: None,
      plutus_v1_script: None,
      plutus_data: None,
      redeemer: Some(redeemers.into()),
      plutus_v2_script: None,
      plutus_v3_script: None,
    },
    success: true,
    auxiliary_data,
  }
}

pub fn dsl_to_cbor(raw: String) -> String {
  let tx = dsl_to_tx(raw.to_string());
  let mut tx_buf: Vec<u8> = Vec::new();
  let _ = encode(tx, &mut tx_buf);
  hex::encode(tx_buf.clone())
}

pub fn dsl_to_cbor_hex(raw: String) -> Vec<u8> {
  let tx = dsl_to_tx(raw.to_string());
  let mut tx_buf: Vec<u8> = Vec::new();
  let _ = encode(tx, &mut tx_buf);
  tx_buf
}
