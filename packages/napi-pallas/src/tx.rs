use crate::{
  Asset, Assets, CborResponse, Certificates, Collateral, Datum, ExUnits, Input, Metadata, Redeemer,
  SafeCborResponse, Utxo, Withdrawal, Witness, Witnesses,
};
use pallas::ledger::primitives::conway::DatumOption;
use pallas::ledger::traverse::{
  MultiEraCert, MultiEraInput, MultiEraPolicyAssets, MultiEraRedeemer,
};
use pallas_crypto::hash::Hasher;
use pallas_primitives::conway::VKeyWitness;
use std::collections::HashMap;

use pallas::ledger::{
  primitives::ToCanonicalJson,
  traverse::{ComputeHash, MultiEraTx},
};
use pallas_codec::utils::KeyValuePairs;
use pallas_primitives::{
  alonzo::RedeemerTag,
  conway::{Metadatum, RedeemerTag as RedeemerTagConway},
  Fragment,
};

pub(crate) fn get_inputs(inputs: &Vec<MultiEraInput<'_>>) -> Vec<Input> {
  inputs
    .iter()
    .map(|i| Input {
      tx_hash: i.hash().to_string(),
      index: i.index() as i64,
    })
    .collect()
}

fn build_datum(datum: DatumOption) -> Datum {
  match datum {
    DatumOption::Hash(x) => Datum {
      hash: x.to_string(),
      bytes: "".to_string(),
      json: "".to_string(),
    },
    DatumOption::Data(x) => Datum {
      hash: x.compute_hash().to_string(),
      bytes: hex::encode(x.raw_cbor()),
      json: serde_json::to_string(&x.to_json()).unwrap(),
    },
  }
}

fn build_assets_with_same_policy(asset: MultiEraPolicyAssets<'_>) -> Assets {
  Assets {
    policy_id: asset.policy().to_string(),
    assets_policy: asset
      .assets()
      .iter()
      .map(|asset| Asset {
        asset_name: hex::encode(asset.name()),
        asset_name_ascii: asset.to_ascii_name(),
        amount: asset.output_coin().map(|x| x as i64),
      })
      .collect(),
  }
}

pub(crate) fn get_outputs(tx: &MultiEraTx<'_>) -> Result<Vec<Utxo>, String> {
  tx.outputs()
    .iter()
    .enumerate()
    .map(|(index, o)| {
      let address = o
        .address()
        .map_err(|_| format!("Failed to parse output address at index {index}"))?;

      Ok(Utxo {
        tx_hash: tx.hash().to_string(),
        index: index as i64,
        bytes: hex::encode(o.encode()),
        address: address.to_string(),
        lovelace: o.value().coin() as i64,
        datum: o.datum().map(|x: DatumOption| build_datum(x)),
        script_ref: o
          .script_ref()
          .and_then(|x| x.encode_fragment().ok().map(hex::encode)),
        assets: o
          .value()
          .assets()
          .into_iter()
          .map(|x| build_assets_with_same_policy(x))
          .collect(),
      })
    })
    .collect()
}

pub(crate) fn get_mints(tx: &MultiEraTx<'_>) -> Vec<Assets> {
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
          amount: asset.mint_coin(),
        })
        .collect(),
    })
    .collect()
}

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
        Some((key_str.clone(), metadatum_to_string(value)))
      } else {
        None // Ignore non-text keys
      }
    })
    .collect()
}

pub(crate) fn get_metadata(tx: &MultiEraTx<'_>) -> Vec<Metadata> {
  match tx.metadata().as_alonzo() {
    Some(metadata) => metadata
      .iter()
      .map(|(k, v)| {
        let json_metadata = match v {
          Metadatum::Map(map) => map_to_hashmap(map),
          _ => {
            let json_value = serde_json::to_value(v).expect("Failed to convert to JSON");
            let json_string = serde_json::to_string(&json_value).expect("Failed to serialize JSON");
            let mut hashmap = HashMap::new();
            hashmap.insert("value".to_string(), json_string);
            hashmap
          }
        };
        Metadata {
          label: format!("{:?}", k),
          json_metadata,
        }
      })
      .collect(),
    None => vec![],
  }
}

pub(crate) fn get_withdrawals(tx: &MultiEraTx<'_>) -> Vec<Withdrawal> {
  match tx.withdrawals().as_alonzo() {
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
  }
}

pub(crate) fn get_certificates(tx: &MultiEraTx<'_>) -> Vec<Certificates> {
  tx.certs()
    .iter()
    .map(|cert| match cert {
      MultiEraCert::NotApplicable => Certificates {
        json: "Not applicable".to_string(),
      },
      MultiEraCert::AlonzoCompatible(cow) => Certificates {
        json: serde_json::to_string(&cow).unwrap(),
      },
      MultiEraCert::Conway(cow) => Certificates {
        json: serde_json::to_string(&cow).unwrap(),
      },
      _ => Certificates {
        json: "Not implemented".to_string(),
      },
    })
    .collect()
}

pub(crate) fn get_collaterals(tx: &MultiEraTx<'_>) -> Collateral {
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

fn build_witness(wit: &VKeyWitness) -> Witness {
  Witness {
    key: hex::encode(wit.vkey.as_slice()),
    hash: hex::encode(Hasher::<224>::hash(wit.vkey.as_slice())),
    signature: hex::encode(wit.signature.as_slice()),
  }
}

fn build_redeemer(r: &MultiEraRedeemer<'_>) -> Redeemer {
  match r {
    MultiEraRedeemer::AlonzoCompatible(redeemer) => Redeemer {
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
    MultiEraRedeemer::Conway(key, data) => Redeemer {
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
  }
}

pub(crate) fn get_witnesses(tx: &MultiEraTx<'_>) -> Witnesses {
  Witnesses {
    vkey_witnesses: tx.vkey_witnesses().iter().map(build_witness).collect(),
    redeemers: tx.redeemers().iter().map(|x| build_redeemer(x)).collect(),
    plutus_data: tx
      .plutus_data()
      .iter()
      .map(|x| Datum {
        hash: x.compute_hash().to_string(),
        bytes: hex::encode(x.raw_cbor()),
        json: x.to_json().to_string(),
      })
      .collect(),
    plutus_v1_scripts: tx.plutus_v1_scripts().iter().map(hex::encode).collect(),
    plutus_v2_scripts: tx.plutus_v2_scripts().iter().map(hex::encode).collect(),
    plutus_v3_scripts: tx.plutus_v3_scripts().iter().map(hex::encode).collect(),
  }
}

pub(crate) fn parse_tx_from_multiera(
  tx: &MultiEraTx<'_>,
  include_cbor: bool,
) -> Result<CborResponse, String> {
  let inputs = get_inputs(&tx.inputs());
  let reference_inputs = get_inputs(&tx.reference_inputs());
  let outputs = get_outputs(tx)?;
  let mints = get_mints(tx);
  let metadata = get_metadata(tx);
  let withdrawals = get_withdrawals(tx);
  let certificates = get_certificates(tx);
  let collateral = get_collaterals(tx);
  let witnesses = get_witnesses(tx);

  let cbor = if include_cbor {
    Some(hex::encode(tx.encode()))
  } else {
    None
  };

  Ok(CborResponse::new().with_cbor_attr(
    tx.clone(),
    inputs,
    reference_inputs,
    outputs,
    mints,
    metadata,
    withdrawals,
    certificates,
    collateral,
    witnesses,
    cbor,
  ))
}

pub fn cbor_to_tx(raw: String) -> SafeCborResponse {
  SafeCborResponse::new().try_build(|| {
    let cbor = hex::decode(raw).map_err(|e| format!("Failed to decode hex. {}", e))?;
    let tx = MultiEraTx::decode(&cbor).map_err(|e| format!("Failed to decode tx. {}", e))?;
    parse_tx_from_multiera(&tx, false)
  })
}
