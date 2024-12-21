use crate::utils::{FIXED_HASH, FIXED_POLICY};
use pallas_addresses::Address;
use pallas_codec::minicbor::{display, encode};
use pallas_crypto::hash::Hash;
use pallas_primitives::alonzo::{BoundedBytes, PostAlonzoAuxiliaryData, Value as AlonzoValue};
use pallas_primitives::conway::{
  AuxiliaryData, Coin, DatumOption, ExUnits as CExUnits, Multiasset, PostAlonzoTransactionOutput,
  Redeemers, RedeemersKey, RedeemersValue, RewardAccount, Tx, WitnessSet,
};
use pallas_primitives::Fragment;
use regex::Regex;
use serde_json::{json, Value};
use std::collections::{HashMap, HashSet};
use std::str::FromStr;

use pallas::ledger::primitives::conway::PlutusData;
use pallas_codec::utils::{
  Bytes, CborWrap, KeyValuePairs, NonEmptyKeyValuePairs, NonEmptySet, NonZeroInt, Nullable, Set,
};
use pallas_primitives::conway::{
  AssetName, Metadatum, PseudoTransactionBody, RedeemerTag as RedeemerTagConway, TransactionInput,
  TransactionOutput,
};

static SCHEMA_JSON: &str = include_str!("../.././docs/schema.json");

pub fn preprocess_json(raw: &str) -> Result<Value, serde_json::Error> {
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

fn build_redeemer(input: &Value, redeemers_vec: &mut Vec<(RedeemersKey, RedeemersValue)>) {
  if let Some(redeemer) = input["redeemer"].as_object() {
    let tag = RedeemerTagConway::Spend;
    let index = input["index"].as_u64().unwrap() as u32;

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
}

fn build_inputs_and_redeemers(inputs: &Value) -> (Set<TransactionInput>, Option<Redeemers>) {
  let mut redeemers_vec: Vec<(RedeemersKey, RedeemersValue)> = vec![];
  let inputs = Set::from(
    inputs
      .as_array()
      .unwrap_or(&vec![])
      .iter()
      .map(|x| {
        build_redeemer(x, &mut redeemers_vec);
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

  let redeemers: Option<Redeemers> = if redeemers_vec.is_empty() {
    None
  } else {
    Some(
      NonEmptyKeyValuePairs::try_from(redeemers_vec.clone())
        .unwrap()
        .into(),
    )
  };
  (inputs, redeemers)
}

fn build_ref_inputs(ref_inputs: &Value) -> Option<NonEmptySet<TransactionInput>> {
  let inputs_iter: Vec<TransactionInput> = ref_inputs
    .as_array()
    .unwrap_or(&vec![])
    .iter()
    .map(|x| TransactionInput {
      transaction_id: {
        let tx_hash_value = x["txHash"].as_str().unwrap();
        let bytes = hex::decode(tx_hash_value).unwrap();
        let array: [u8; 32] = bytes.try_into().unwrap();
        Hash::<32>::new(array)
      },
      index: x["index"].as_u64().unwrap(),
    })
    .into_iter()
    .collect();

  match NonEmptySet::try_from(inputs_iter) {
    Ok(set) => Some(set),
    Err(_) => None,
  }
}

fn get_asset_info_and_build_mint(
  asset: &Value,
  lovelace_am: &mut u64,
  transformed_assets: &mut HashMap<Hash<28>, KeyValuePairs<Bytes, u64>>,
  mint_kv_map: &mut HashMap<Hash<28>, NonEmptyKeyValuePairs<Bytes, NonZeroInt>>,
) {
  let asset_name: Vec<u8>;
  let amount = asset["amount"].as_u64().unwrap();
  let policy_hash: Hash<28>;

  if asset["assetClass"].is_null() {
    asset_name = asset["name"].as_str().unwrap().as_bytes().to_vec();
    policy_hash = FIXED_POLICY;
  } else {
    asset_name = hex::decode(&asset["assetClass"].as_str().unwrap()[57..]).unwrap();
    policy_hash = Hash::<28>::from_str(&asset["assetClass"].as_str().unwrap()[..56]).unwrap();
  }

  if asset_name == b"lovelace".to_vec() {
    *lovelace_am += amount;
  } else {
    let asset_entry = Bytes::from(asset_name.clone());
    transformed_assets
      .entry(policy_hash)
      .and_modify(|existing| match existing {
        KeyValuePairs::Def(vec) | KeyValuePairs::Indef(vec) => {
          if let Some((_, current_amount)) = vec.iter_mut().find(|(name, _)| *name == asset_entry) {
            *current_amount += amount; // TODO: Fix schema to make sure there are no duplicates
          } else {
            vec.push((asset_entry.clone(), amount));
          }
        }
      })
      .or_insert_with(|| KeyValuePairs::from(vec![(asset_entry, amount)]));

    // TODO: Check when "minted" field is available
    if !asset["minted"].is_null() {
      let am: NonZeroInt = TryFrom::try_from(amount as i64).unwrap();
      mint_kv_map
        .entry(policy_hash)
        .and_modify(|existing| {
          match existing {
            NonEmptyKeyValuePairs::Def(vec) | NonEmptyKeyValuePairs::Indef(vec) => {
              vec.push((Bytes::from(asset_name.clone()), am))
            }
          };
        })
        .or_insert(NonEmptyKeyValuePairs::Def(vec![(
          AssetName::from(asset_name.clone()),
          am,
        )]));
    }
  }
}

fn build_output_values_and_mint(
  values_array: &Vec<Value>,
  mut mint_kv_map: &mut HashMap<Hash<28>, NonEmptyKeyValuePairs<Bytes, NonZeroInt>>,
) -> AlonzoValue {
  let mut lovelace_am = 0;
  let mut transformed_assets: HashMap<Hash<28>, KeyValuePairs<Bytes, u64>> = HashMap::new();

  values_array.iter().for_each(|asset| {
    get_asset_info_and_build_mint(
      asset,
      &mut lovelace_am,
      &mut transformed_assets,
      &mut mint_kv_map,
    );
  });

  if transformed_assets.len() > 0 {
    AlonzoValue::Multiasset(
      lovelace_am,
      KeyValuePairs::from(transformed_assets.into_iter().collect::<Vec<_>>()),
    )
  } else {
    AlonzoValue::Coin(values_array[0]["amount"].as_u64().unwrap())
  }
}

fn build_output_datum(output: &Value) -> Option<DatumOption> {
  output.get("datum").and_then(|datum| {
    datum
      .get("hash")
      .and_then(|datum_hash| {
        let datum_hash = datum_hash.as_str()?;
        let bytes = hex::decode(datum_hash).ok()?;
        let array: [u8; 32] = bytes.try_into().ok()?;
        Some(DatumOption::Hash(Hash::<32>::new(array)))
      })
      .or_else(|| {
        datum.get("bytes").and_then(|datum_bytes| {
          let bytes = hex::decode(datum_bytes.as_str()?).ok()?;
          Some(DatumOption::Data(CborWrap(
            PlutusData::decode_fragment(&bytes).ok()?,
          )))
        })
      })
  })
}

fn get_output_address(address: &Value) -> Bytes {
  match address {
    Value::String(address) => Address::from_bech32(address).unwrap().to_vec().into(),
    _ => Bytes::from(vec![]), //TODO: Use fixed address
  }
}

fn build_outputs_and_maybe_mints(
  outputs: &Value,
) -> (Vec<TransactionOutput>, Option<Multiasset<NonZeroInt>>) {
  let mut mint: Option<Multiasset<NonZeroInt>> = None;
  let mut mint_kv_map: HashMap<Hash<28>, NonEmptyKeyValuePairs<Bytes, NonZeroInt>> = HashMap::new();

  let outputs = outputs
    .as_array()
    .unwrap_or(&vec![])
    .iter()
    .map(|x| {
      TransactionOutput::PostAlonzo(PostAlonzoTransactionOutput {
        address: get_output_address(&x["address"]),
        value: build_output_values_and_mint(x["values"].as_array().unwrap(), &mut mint_kv_map),
        datum_option: build_output_datum(x),
        script_ref: None,
      })
    })
    .collect::<Vec<TransactionOutput>>();

  if !mint_kv_map.is_empty() {
    mint = Some(NonEmptyKeyValuePairs::Def(
      mint_kv_map.into_iter().collect(),
    ));
  }
  (outputs, mint)
}

fn build_mints(
  mints: &Value,
) -> Option<NonEmptyKeyValuePairs<Hash<28>, NonEmptyKeyValuePairs<Bytes, NonZeroInt>>> {
  mints.as_array().map(|mint| {
    let mut mint_kv_map: HashMap<Hash<28>, NonEmptyKeyValuePairs<Bytes, NonZeroInt>> =
      HashMap::new();

    for asset in mint.iter() {
      let asset_name: Vec<u8>;
      let mut policy_hash: Hash<28> = FIXED_POLICY;
      if asset["assetClass"].is_null() {
        asset_name = asset["name"].as_str().unwrap().as_bytes().to_vec();
      } else {
        asset_name = hex::decode(&asset["assetClass"].as_str().unwrap()[57..]).unwrap();
        policy_hash = Hash::<28>::from_str(&asset["assetClass"].as_str().unwrap()[..56]).unwrap();
      }

      let am: NonZeroInt = TryFrom::try_from(asset["amount"].as_i64().unwrap()).unwrap();
      mint_kv_map
        .entry(policy_hash)
        .and_modify(|existing| {
          match existing {
            NonEmptyKeyValuePairs::Def(vec) | NonEmptyKeyValuePairs::Indef(vec) => {
              vec.push((Bytes::from(asset_name.clone()), am))
            }
          };
        })
        .or_insert(NonEmptyKeyValuePairs::Def(vec![(
          AssetName::from(asset_name.clone()),
          am,
        )]));
    }

    Multiasset::Def(mint_kv_map.into_iter().collect())
  })
}

fn build_withdrawals(withdrawals: &Value) -> Option<KeyValuePairs<RewardAccount, Coin>> {
  if withdrawals.is_null() {
    None
  } else {
    Some(KeyValuePairs::from(Vec::from(
      withdrawals
        .as_array()
        .unwrap()
        .iter()
        .filter_map(|entry| {
          let raw_address = entry["raw_address"].as_str()?;
          let amount = entry["amount"].as_u64()?;

          let address_bytes = raw_address.as_bytes().to_vec();
          let reward_account = Bytes::from(address_bytes);

          Some((reward_account, amount))
        })
        .collect::<Vec<(RewardAccount, Coin)>>(),
    )))
  }
}

fn get_metadata_metadatum(value: &Value) -> Metadatum {
  match serde_json::from_value::<serde_json::Value>(value.clone()) {
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
  }
}

fn build_metadata(metadata: &Value) -> Option<KeyValuePairs<u64, Metadatum>> {
  if metadata.is_null() {
    None
  } else {
    Some(KeyValuePairs::from(
      metadata
        .as_array()
        .unwrap()
        .iter()
        .filter_map(|entry| {
          let label = entry["label"].as_u64()?;
          let json_metadata = entry["json_metadata"].as_object()?;
          let mut map_vec: Vec<(Metadatum, Metadatum)> = vec![];

          for (key, value) in json_metadata.iter() {
            map_vec.push((Metadatum::Text(key.clone()), get_metadata_metadatum(value)));
          }
          Some((label, Metadatum::Map(map_vec.into())))
        })
        .collect::<Vec<(u64, Metadatum)>>(),
    ))
  }
}

fn build_aux_data(metadata: Option<KeyValuePairs<u64, Metadatum>>) -> Nullable<AuxiliaryData> {
  if metadata.is_none() {
    Nullable::Null
  } else {
    Some(AuxiliaryData::PostAlonzo(PostAlonzoAuxiliaryData {
      metadata,
      native_scripts: None,
      plutus_scripts: None,
    }))
    .into()
  }
}

pub fn dsl_to_tx(raw: String) -> Tx {
  let res: Value = preprocess_json(&raw).unwrap();

  let (inputs, redeemers) = build_inputs_and_redeemers(&res["transaction"]["inputs"]);

  let reference_inputs = build_ref_inputs(&res["transaction"]["ref_inputs"]);

  let (outputs, mut mint) = build_outputs_and_maybe_mints(&res["transaction"]["outputs"]);

  if !res["transaction"]["minting"].is_null() {
    mint = build_mints(&res["transaction"]["minting"])
  }

  let withdrawals = build_withdrawals(&res["transaction"]["withdrawals"]);

  let metadata = build_metadata(&res["transaction"]["metadata"]);

  let auxiliary_data = build_aux_data(metadata);

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
    reference_inputs,
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
      redeemer: redeemers,
      plutus_v2_script: None,
      plutus_v3_script: None,
    },
    success: true,
    auxiliary_data,
  }
}

pub fn dsl_to_cbor_hex(raw: String) -> String {
  let tx = dsl_to_tx(raw.to_string());
  let mut tx_buf: Vec<u8> = Vec::new();
  let _ = encode(tx, &mut tx_buf);
  hex::encode(tx_buf.clone())
}

pub fn dsl_to_cbor_diagnostic(raw: String) -> String {
  let tx = dsl_to_tx(raw.to_string());
  let mut tx_buf: Vec<u8> = Vec::new();
  let _ = encode(tx, &mut tx_buf);

  let diagnostic = display(&tx_buf).to_string();
  // Format hex strings in diagnostic notation
  let hex_pattern = Regex::new(r"h'([0-9a-fA-F\s]+)'").unwrap();
  let formatted_diagnostic = hex_pattern.replace_all(&diagnostic, |caps: &regex::Captures| {
    let hex = &caps[1];
    let cleaned_hex = hex.replace(' ', "").to_uppercase();
    format!("h'{}'", cleaned_hex)
  });

  formatted_diagnostic.to_string()
}

pub fn parse_dsl(raw: String) -> String {
  let schema: Value = serde_json::from_str(&SCHEMA_JSON).unwrap();

  let res: Value = match serde_json::from_str(&raw) {
    Ok(json) => json,
    Err(_) => return json!({ "error": "Input is not a valid JSON." }).to_string(),
  };

  let validator = jsonschema::validator_for(&schema).unwrap();
  let result = validator.validate(&res);

  match result {
    Ok(_) => {
      json!({"cbor_hex": dsl_to_cbor_hex(raw.clone()), "cbor_diagnostic": dsl_to_cbor_diagnostic(raw.clone())})
        .to_string()
    }
    Err(e) => json!(
      {
        "error": e.to_string(),
        "instance_path": e.instance_path.to_string(),
      }
    )
    .to_string(),
  }
}
