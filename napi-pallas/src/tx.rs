use std::collections::HashMap;

use crate::{
  compute_datum_hashmap, Assets, CborResponse, Datum as DatumInfo, InputUtxo, OutputUtxo,
};

use pallas::{
  codec::utils::KeepRaw,
  crypto::hash::Hasher,
  ledger::{
    primitives::{conway::PlutusData, ToCanonicalJson},
    traverse::{ComputeHash, MultiEraTx},
  },
};
use pallas_primitives::{
  conway::{DatumHash, PseudoDatumOption},
  Fragment,
};

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
        }
      })
      .collect();

    let parsed_cbor =
      CborResponse::new().with_cbor_attr(tx, inputs, reference_inputs, outputs, mints);

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
