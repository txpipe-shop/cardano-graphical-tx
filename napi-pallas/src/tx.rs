use crate::constants::{FIXED_HASH, FIXED_POLICY};
use crate::{
  Asset, Assets, CborResponse, Certificates, Collateral, Datum, ExUnits, Input, Metadata, Redeemer,
  Utxo, Withdrawal, Witness, Witnesses,
};
use pallas_crypto::hash::{Hash, Hasher};
use pallas_primitives::alonzo::Value as AlonzoValue;
use pallas_primitives::conway::{
  Coin, Multiasset, PostAlonzoTransactionOutput, PseudoTransactionOutput, RewardAccount,
};
use serde_json::{json, Value};
use std::str::FromStr;
use std::{collections::HashMap, fs, path::Path};

use pallas::ledger::{
  primitives::{conway::PlutusData, ToCanonicalJson},
  traverse::{ComputeHash, MultiEraTx},
};
use pallas_codec::utils::{Bytes, KeyValuePairs, Nullable, Set};
use pallas_primitives::{
  alonzo::RedeemerTag,
  conway::{
    Metadatum, PseudoTransactionBody, RedeemerTag as RedeemerTagConway, TransactionInput,
    TransactionOutput,
  },
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

fn get_outputs(tx: &MultiEraTx<'_>) -> Vec<Utxo> {
  tx.outputs()
    .iter()
    .enumerate()
    .map(|(index, o)| Utxo {
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
              let amount = asset.output_coin().map(|x| x as i64);
              Asset {
                asset_name,
                asset_name_ascii,
                amount,
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
          amount: asset.mint_coin().map(|x| x as i64),
        })
        .collect(),
    })
    .collect()
}

fn get_collaterals(tx: &MultiEraTx<'_>) -> Collateral {
  Collateral {
    total: tx.total_collateral().map(|x| x as i64),
    collateral_return: tx
      .collateral()
      .iter()
      .map(|i| Input {
        tx_hash: i.hash().to_string(),
        index: i.index() as i64,
      })
      .collect(),
  }
}

fn get_witnesses(tx: &MultiEraTx<'_>) -> Witnesses {
  Witnesses {
    vkey_witnesses: tx
      .vkey_witnesses()
      .iter()
      .map(|wit| Witness {
        key: hex::encode(wit.vkey.as_slice()),
        hash: hex::encode(Hasher::<224>::hash(wit.vkey.as_slice())),
        signature: hex::encode(wit.signature.as_slice()),
      })
      .collect(),
    redeemers: tx
      .redeemers()
      .iter()
      .map(|x| match x {
        pallas::ledger::traverse::MultiEraRedeemer::AlonzoCompatible(redeemer) => Redeemer {
          tag: match &redeemer.tag {
            RedeemerTag::Spend => "Spend".to_owned(),
            RedeemerTag::Mint => "Mint".to_owned(),
            RedeemerTag::Cert => "Cert".to_owned(),
            RedeemerTag::Reward => "Reward".to_owned(),
          },
          index: redeemer.index,
          data_json: redeemer.data.to_json().to_string(),
          ex_units: ExUnits {
            mem: redeemer.ex_units.mem as i64,
            steps: redeemer.ex_units.steps as i64,
          },
        },
        pallas::ledger::traverse::MultiEraRedeemer::Conway(key, data) => Redeemer {
          tag: match key.tag {
            RedeemerTagConway::Spend => "Spend".to_owned(),
            RedeemerTagConway::Mint => "Mint".to_owned(),
            RedeemerTagConway::Cert => "Cert".to_owned(),
            RedeemerTagConway::Reward => "Reward".to_owned(),
            RedeemerTagConway::Vote => "Vote".to_owned(),
            RedeemerTagConway::Propose => "Propose".to_owned(),
          },
          index: key.index,
          data_json: data.data.to_json().to_string(),
          ex_units: ExUnits {
            mem: data.ex_units.mem as i64,
            steps: data.ex_units.steps as i64,
          },
        },
        _ => Redeemer {
          tag: "Redeemer structure not matched".to_string(),
          index: 0,
          data_json: "".to_string(),
          ex_units: ExUnits { mem: 0, steps: 0 },
        },
      })
      .collect(),
    plutus_data: tx
      .plutus_data()
      .iter()
      .map(|x| Datum {
        hash: x.compute_hash().to_string(),
        bytes: hex::encode(x.raw_cbor()),
        json: x.to_json().to_string(),
      })
      .collect(),
    plutus_v1_scripts: tx
      .plutus_v1_scripts()
      .iter()
      .map(|x| hex::encode(x))
      .collect(),
    plutus_v2_scripts: tx
      .plutus_v2_scripts()
      .iter()
      .map(|x| hex::encode(x))
      .collect(),
    plutus_v3_scripts: tx
      .plutus_v3_scripts()
      .iter()
      .map(|x| hex::encode(x))
      .collect(),
  }
}

pub fn new_parse(raw: String) -> Result<CborResponse, CborResponse> {
  let out = CborResponse::new().try_build(|| {
    let cbor = hex::decode(raw)?;
    let tx = MultiEraTx::decode(&cbor)?;

    let inputs: Vec<Input> = tx
      .inputs()
      .iter()
      .map(|i| Input {
        tx_hash: i.hash().to_string(),
        index: i.index() as i64,
      })
      .collect();

    let reference_inputs: Vec<Input> = tx
      .reference_inputs()
      .iter()
      .map(|i| Input {
        tx_hash: i.hash().to_string(),
        index: i.index() as i64,
      })
      .collect();

    let mints: Vec<Assets> = get_mints(&tx);

    let outputs: Vec<Utxo> = get_outputs(&tx);
    let metadata: Vec<Metadata> = match tx.metadata().as_alonzo() {
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

          Metadata {
            label: label_str,
            json_metadata,
          }
        })
        .collect(),
      None => vec![],
    };

    let withdrawals: Vec<Withdrawal> = match tx.withdrawals().as_alonzo() {
      Some(withdrawals) => withdrawals
        .iter()
        .map(|(k, v)| {
          // TODO - parse address into bech32
          Withdrawal {
            raw_address: k.to_string(),
            amount: v.to_owned() as i64,
          }
        })
        .collect(),
      None => vec![],
    };

    let certificates: Vec<Certificates> = tx
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

    let collateral = get_collaterals(&tx);

    let witnesses = get_witnesses(&tx);

    let parsed_cbor = CborResponse::new().with_cbor_attr(
      tx,
      inputs,
      reference_inputs,
      outputs,
      mints,
      metadata,
      withdrawals,
      certificates,
      collateral,
      witnesses,
    );

    Ok(parsed_cbor)
  });

  Ok(out)
}

pub fn parse_datum_info(raw: String) -> Option<Datum> {
  let cbor = hex::decode(raw.clone()).ok()?;
  let data = PlutusData::decode_fragment(&cbor).ok()?;

  Some(Datum {
    hash: Hasher::<256>::hash(&cbor).to_string(),
    json: data.to_json().to_string(),
    bytes: raw.clone(),
  })
}

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
    Ok(_) => "JSON is valid!".to_string(),
    Err(e) => json!(
      {
        "error": e.to_string(),
        "instance_path": e.instance_path.to_string(),
      }
    )
    .to_string(),
  }
}

pub fn json_to_serde(raw: String) -> Value {
  let res: Value = match serde_json::from_str(&raw) {
    Ok(json) => json,
    Err(_) => return json!({ "error": "Input is not a valid JSON." }),
  };

  res
}

#[test]
pub fn example() {
  let raw = r#"{
    "transaction": {
        "name": "example",
        "fee": 1,
        "start": 123,
        "ttl": 321,
        "inputs": [
            {
                "name": "wallet-A",
                "index": 0
            },
            {
                "txHash": "49388b9499370a6ffd383fcde59a6a075192c73bb6fb08f93efcf24c6ddbcabb",
                "index": 1
            },
            {
                "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
                "redeemer": {
                    "name": "r",
                    "number": 1232112
                }
            },
            {
                "name": "wallet-A",
                "values": [
                    {
                        "amount": 10,
                        "name": "ADA"
                    }
                ]
            },
            {
                "name": "wallet-A",
                "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
                "values": [
                    {
                        "amount": 10,
                        "name": "lovelace"
                    },
                    {
                        "amount": 10,
                        "assetClass": "391589af6db9d9008e3e0952563f8d1d5c18cdb8ea0c300bfc1e60b6.414e4f4e3066396466613433"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "wallet-de-sofi",
                "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
                "values": [
                    {
                        "amount": 9,
                        "name": "lovelace"
                    },
                    {
                        "amount": 123,
                        "name": "New Token"
                    }
                ]
            },
            {
                "name": "wallet-A",
                "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
                "values": [
                    {
                        "amount": 100,
                        "name": "lovelace"
                    },
                    {
                        "amount": 10,
                        "assetClass": "391589af6db9d9008e3e0952563f8d1d5c18cdb8ea0c300bfc1e60b6.414e4f4e3066396466613433"
                    }
                ]
            },
            {
                "name": "extra",
                "values": [
                    {
                        "amount": 320,
                        "name": "lovelace"
                    }
                ]
            }
        ],
        "minting": [
            {
                "amount": 123,
                "name": "New Token"
            },
            {
                "amount": 1231,
                "name": "Other Token"
            }
        ],
        "withdrawals": [
            {
                "raw_address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
                "amount": 123
            }
        ],
        "metadata": [
            {
                "label": 674,
                "json_metadata": {
                    "key": "value"
                }
            }
        ]
    }
}"#;

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

  let res: Value = preprocess_json(raw).unwrap();
  let inputs = Set::from(
    res["transaction"]["inputs"]
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
      .collect::<Vec<TransactionInput>>(),
  );

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

              let kv_pairs = KeyValuePairs::from(vec![(Bytes::from(asset_name), amount)]);
              let res = match policy_hash {
                Some(hash) => Some((hash, kv_pairs)),
                None => None,
              };
              res
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

  let withdrawals: Option<KeyValuePairs<RewardAccount, Coin>> =
    Some(KeyValuePairs::from(Vec::from(
      res["transaction"]["withdrawals"]
        .as_array()
        .unwrap_or(&vec![]) // Maneja el caso de que no sea un array
        .iter() // Itera sobre los elementos del array
        .filter_map(|entry| {
          let raw_address = entry["raw_address"].as_str()?; // Obtén el raw_address como &str
          let amount = entry["amount"].as_u64()?; // Obtén el amount como u64

          // Convierte raw_address a Bytes (RewardAccount)
          let address_bytes = raw_address.as_bytes().to_vec(); // Convierte &str -> Vec<u8>
          let reward_account = Bytes::from(address_bytes); // Vec<u8> -> Bytes

          Some((reward_account, amount)) // Devuelve la tupla si todo es válido
        })
        .collect::<Vec<(RewardAccount, Coin)>>(), // Colecciona los resultados en un Vec
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

  let tx = Tx {
    transaction_body: transaction_body.clone(),
    transaction_witness_set: WitnessSet {
      vkeywitness: None,
      native_script: None,
      bootstrap_witness: None,
      plutus_v1_script: None,
      plutus_data: None,
      redeemer: None, // TODO: Add inputs reedemers
      plutus_v2_script: None,
      plutus_v3_script: None,
    },
    success: true,
    auxiliary_data,
  };

  print!("transaction_body \n {:?}", transaction_body);
  println!("tx \n{:?}", tx);
}
