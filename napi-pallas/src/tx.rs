use std::collections::HashMap;

use crate::{
  compute_datum_hashmap, Assets, CborResponse, Datum as DatumInfo, InputUtxo, OutputUtxo,
};

use pallas::{
  codec::utils::KeepRaw,
  ledger::{
    primitives::{conway::PlutusData, ToCanonicalJson},
    traverse::{ComputeHash, MultiEraTx},
  },
};
use pallas_primitives::conway::{DatumHash, PseudoDatumOption};

pub fn new_parse(raw: String) -> Result<CborResponse, CborResponse> {
  let out = CborResponse::new().try_build(|| {
    let cbor = hex::decode(raw)?;
    let tx = MultiEraTx::decode(&cbor)?;

    let mut inputs = Vec::new();
    for i in tx.inputs() {
      inputs.push(InputUtxo {
        tx_hash: i.hash().to_string(),
        index: i.index().to_string(),
      });
    }

    let mut reference_inputs = Vec::new();
    for i in tx.reference_inputs() {
      reference_inputs.push(InputUtxo {
        tx_hash: i.hash().to_string(),
        index: i.index().to_string(),
      });
    }

    let mut mints = Vec::new();
    for mint in tx.mints() {
      let policy = mint.policy().to_string();
      let asset_name = mint
        .assets()
        .iter()
        .map(|x| hex::encode(x.name()))
        .collect();
      let quantity = mint
        .assets()
        .iter()
        .map(|x| match x.mint_coin() {
          Some(value) => value.to_string(),
          None => String::from("None"),
        })
        .collect();
      mints.push(Assets {
        policy_id: policy,
        asset_name,
        quantity,
      });
    }
    
    let mut outputs = Vec::new();
    let tx_copy = tx.clone();
    let datum_hashmap = compute_datum_hashmap(tx_copy);
    let mut outputs_count = 0;
    
    for o in tx.outputs() {
      let lovelace = o.lovelace_amount();
      let other_assets: Vec<Assets> = o
        .non_ada_assets()
        .iter()
        .flat_map(|x| {
          let policy = x.policy().to_string();
          let assets_in_this_policy = x.assets();
          let mut parsed_assets: Vec<Assets> = Vec::new();

          if assets_in_this_policy.len() > 1 {
            for asset in assets_in_this_policy {
              let asset_name = hex::encode(asset.name());
              let quantity = match asset.output_coin() {
                Some(value) => value.to_string(),
                None => String::from("None"),
              };
              parsed_assets.push(Assets {
                policy_id: policy.clone(),
                asset_name,
                quantity,
              });
            }

          } else {
            let asset_name = hex::encode(assets_in_this_policy[0].name());
            let quantity = match assets_in_this_policy[0].output_coin() {
              Some(value) => value.to_string(),
              None => String::from("None"),
            };

            parsed_assets.push(Assets {
              policy_id: policy,
              asset_name,
              quantity,
            });
          }

          parsed_assets
        }).collect::<Vec<Assets>>();

      let mut assets: Vec<Assets> = other_assets;
      assets.push(Assets {
        policy_id: "".to_string(),
        asset_name: "lovelace".to_string(),
        quantity: lovelace.to_string(),
      });

      let datum_info = get_datum_info(&o.datum(), &datum_hashmap);
      outputs.push(OutputUtxo {
        tx_hash: tx.hash().to_string(),
        index: outputs_count.to_string(),
        address: o.address().unwrap().to_string(),
        assets,
        datum: datum_info,
      });
      outputs_count += 1;
    }

    let parsed_cbor = CborResponse::new().with_cbor_attr(tx, inputs, reference_inputs, outputs, mints);

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
