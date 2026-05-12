use crate::governance;
use crate::{
  Asset, Assets, Bootstrap, CborResponse, Collateral, Datum, ExUnits, Input, Metadata, Redeemer,
  RewardWithdrawal, SafeCborResponse, Utxo, Witness, Witnesses,
};
use pallas::ledger::primitives::conway::DatumOption;
use pallas::ledger::traverse::{MultiEraInput, MultiEraPolicyAssets, MultiEraRedeemer};
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
        asset_name_ascii: Some(String::from_utf8_lossy(asset.name()).into_owned()),
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
          asset_name_ascii: Some(String::from_utf8_lossy(asset.name()).into_owned()),
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

pub(crate) fn get_withdrawals(tx: &MultiEraTx<'_>) -> Vec<RewardWithdrawal> {
  match tx.withdrawals().as_alonzo() {
    Some(withdrawals) => withdrawals
      .iter()
      .map(|(k, v)| RewardWithdrawal {
        reward_account: k.to_string(),
        amount: v.to_owned() as i64,
      })
      .collect(),
    None => vec![],
  }
}

pub(crate) fn get_collaterals(tx: &MultiEraTx<'_>) -> Result<Collateral, String> {
  let collateral_return = tx
    .collateral_return()
    .iter()
    .enumerate()
    .map(|(index, o)| -> Result<Utxo, String> {
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
    .collect::<Result<Vec<Utxo>, String>>()?;
  Ok(Collateral {
    total: tx.total_collateral().map(|x| x as i64),
    inputs: tx
      .collateral()
      .iter()
      .map(|x| Input {
        tx_hash: x.hash().to_string(),
        index: x.index() as i64,
      })
      .collect(),
    collateral_return,
  })
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
    native_scripts: tx
      .native_scripts()
      .iter()
      .map(|x| hex::encode(x.raw_cbor()))
      .collect(),
    bootstrap_witnesses: tx
      .bootstrap_witnesses()
      .iter()
      .map(|x| Bootstrap {
        public_key: hex::encode(x.public_key.as_slice()),
        signature: hex::encode(x.signature.as_slice()),
        chain_code: hex::encode(x.chain_code.as_slice()),
        attributes: hex::encode(x.attributes.as_slice()),
      })
      .collect(),
  }
}

fn get_script_data_hash(tx: &MultiEraTx<'_>) -> Option<String> {
  match tx {
    MultiEraTx::AlonzoCompatible(x, _) => {
      x.transaction_body.script_data_hash.map(|h| h.to_string())
    }
    MultiEraTx::Babbage(x) => x.transaction_body.script_data_hash.map(|h| h.to_string()),
    MultiEraTx::Conway(x) => x.transaction_body.script_data_hash.map(|h| h.to_string()),
    _ => None,
  }
}

fn get_required_signers(tx: &MultiEraTx<'_>) -> Vec<String> {
  tx.required_signers()
    .collect::<Vec<_>>()
    .into_iter()
    .map(|h| h.to_string())
    .collect()
}

fn get_network_id(tx: &MultiEraTx<'_>) -> Option<u8> {
  tx.network_id().map(|n| n.into())
}

fn get_voting_procedures(tx: &MultiEraTx<'_>) -> Vec<governance::VotingProcedureEntry> {
  let conway_tx = match tx.as_conway() {
    Some(x) => x,
    None => return vec![],
  };

  match &conway_tx.transaction_body.voting_procedures {
    Some(vp) => governance::voting_procedures_to_napi(vp),
    None => vec![],
  }
}

fn get_proposal_procedures(tx: &MultiEraTx<'_>) -> Vec<governance::ProposalProcedure> {
  tx.gov_proposals()
    .iter()
    .map(|p| governance::proposal_procedure_to_napi(p))
    .collect()
}

fn get_treasury_value(tx: &MultiEraTx<'_>) -> Option<i64> {
  tx.as_conway().and_then(|x| {
    x.transaction_body
      .treasury_value
      .as_ref()
      .map(|v| *v as i64)
  })
}

fn get_donation(tx: &MultiEraTx<'_>) -> Option<i64> {
  tx.as_conway().and_then(|x| {
    x.transaction_body
      .donation
      .as_ref()
      .map(|v| u64::from(v) as i64)
  })
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
  let certificates = crate::certs::get_certificates(tx);
  let collateral = get_collaterals(tx)?;
  let witnesses = get_witnesses(tx);

  let cbor = if include_cbor {
    Some(hex::encode(tx.encode()))
  } else {
    None
  };

  Ok(CborResponse {
    tx_hash: tx.hash().to_string(),
    fee: tx.fee().map(|x| x as i64),
    era: tx.era().to_string(),
    validity_start: tx.validity_start().map(|v| v as i64),
    ttl: tx.ttl().map(|v| v as i64),
    inputs,
    reference_inputs,
    outputs,
    mints,
    scripts_successful: tx.is_valid(),
    metadata,
    withdrawals,
    certificates,
    collateral,
    witnesses,
    size: tx.size() as i64,
    cbor,
    script_data_hash: get_script_data_hash(tx),
    required_signers: get_required_signers(tx),
    network_id: get_network_id(tx),
    voting_procedures: get_voting_procedures(tx),
    proposal_procedures: get_proposal_procedures(tx),
    treasury_value: get_treasury_value(tx),
    donation: get_donation(tx),
  })
}

pub fn cbor_to_tx(raw: String) -> SafeCborResponse {
  SafeCborResponse::new().try_build(|| {
    let cbor = hex::decode(raw).map_err(|e| format!("Failed to decode hex. {}", e))?;
    let tx = MultiEraTx::decode(&cbor).map_err(|e| format!("Failed to decode tx. {}", e))?;
    parse_tx_from_multiera(&tx, false)
  })
}
