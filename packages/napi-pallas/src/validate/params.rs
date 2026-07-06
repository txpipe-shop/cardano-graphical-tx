use std::collections::BTreeMap;

use pallas::ledger::validate::utils::{AlonzoProtParams, BabbageProtParams, ConwayProtParams};
use pallas_crypto::hash::Hash;
use pallas_primitives::alonzo::{
  ExUnitPrices, ExUnits, Language as AlonzoLanguage, Nonce, NonceVariant, RationalNumber,
};
use pallas_primitives::babbage::CostModels as BabbageCostModels;
use pallas_primitives::conway::{
  CostModels as ConwayCostModels, DRepVotingThresholds, PoolVotingThresholds,
};
use serde::Deserialize;

fn default_unit_interval() -> NapiUnitInterval {
  NapiUnitInterval {
    numerator: 0,
    denominator: 1,
  }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiUnitInterval {
  pub numerator: u64,
  pub denominator: u64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiExUnits {
  pub mem: u64,
  pub steps: u64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiExUnitPrices {
  pub mem_price: NapiUnitInterval,
  pub step_price: NapiUnitInterval,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiCostModels {
  pub plutus_v1: Option<Vec<i64>>,
  pub plutus_v2: Option<Vec<i64>>,
  pub plutus_v3: Option<Vec<i64>>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiNonce {
  pub variant: u8,
  pub hash: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiPoolVotingThresholds {
  pub motion_no_confidence: NapiUnitInterval,
  pub committee_normal: NapiUnitInterval,
  pub committee_no_confidence: NapiUnitInterval,
  pub hard_fork_initiation: NapiUnitInterval,
  pub security_voting_threshold: NapiUnitInterval,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiDRepVotingThresholds {
  pub motion_no_confidence: NapiUnitInterval,
  pub committee_normal: NapiUnitInterval,
  pub committee_no_confidence: NapiUnitInterval,
  pub update_constitution: NapiUnitInterval,
  pub hard_fork_initiation: NapiUnitInterval,
  pub pp_network_group: NapiUnitInterval,
  pub pp_economic_group: NapiUnitInterval,
  pub pp_technical_group: NapiUnitInterval,
  pub pp_governance_group: NapiUnitInterval,
  pub treasury_withdrawal: NapiUnitInterval,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiAlonzoBabbageProtParams {
  pub system_start: i64,
  pub epoch_length: u64,
  pub slot_length: u64,
  pub minfee_a: u32,
  pub minfee_b: u32,
  pub max_block_body_size: u32,
  pub max_transaction_size: u32,
  pub max_block_header_size: u32,
  pub key_deposit: u64,
  pub pool_deposit: u64,
  pub desired_number_of_stake_pools: u32,
  pub protocol_version: [u64; 2],
  pub min_pool_cost: u64,
  pub ada_per_utxo_byte: u64,
  pub cost_models_for_script_languages: NapiCostModels,
  pub execution_costs: NapiExUnitPrices,
  pub max_tx_ex_units: NapiExUnits,
  pub max_block_ex_units: NapiExUnits,
  pub max_value_size: u32,
  pub collateral_percentage: u32,
  pub max_collateral_inputs: u32,
  pub expansion_rate: NapiUnitInterval,
  pub treasury_growth_rate: NapiUnitInterval,
  pub maximum_epoch: u64,
  pub pool_pledge_influence: NapiUnitInterval,
  #[serde(default = "default_unit_interval")]
  pub decentralization_constant: NapiUnitInterval,
  #[serde(default)]
  pub extra_entropy: Option<NapiNonce>,
}

pub type NapiAlonzoProtParams = NapiAlonzoBabbageProtParams;
pub type NapiBabbageProtParams = NapiAlonzoBabbageProtParams;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NapiConwayProtParams {
  pub system_start: i64,
  pub epoch_length: u64,
  pub slot_length: u64,
  pub minfee_a: u32,
  pub minfee_b: u32,
  pub max_block_body_size: u32,
  pub max_transaction_size: u32,
  pub max_block_header_size: u32,
  pub key_deposit: u64,
  pub pool_deposit: u64,
  pub desired_number_of_stake_pools: u32,
  pub protocol_version: [u64; 2],
  pub min_pool_cost: u64,
  pub ada_per_utxo_byte: u64,
  pub cost_models_for_script_languages: NapiCostModels,
  pub execution_costs: NapiExUnitPrices,
  pub max_tx_ex_units: NapiExUnits,
  pub max_block_ex_units: NapiExUnits,
  pub max_value_size: u32,
  pub collateral_percentage: u32,
  pub max_collateral_inputs: u32,
  pub expansion_rate: NapiUnitInterval,
  pub treasury_growth_rate: NapiUnitInterval,
  pub maximum_epoch: u64,
  pub pool_pledge_influence: NapiUnitInterval,
  pub pool_voting_thresholds: NapiPoolVotingThresholds,
  pub drep_voting_thresholds: NapiDRepVotingThresholds,
  pub min_committee_size: u64,
  pub committee_term_limit: u64,
  pub governance_action_validity_period: u64,
  pub governance_action_deposit: u64,
  pub drep_deposit: u64,
  pub drep_inactivity_period: u64,
  pub minfee_refscript_cost_per_byte: NapiUnitInterval,
}

impl From<NapiUnitInterval> for RationalNumber {
  fn from(r: NapiUnitInterval) -> Self {
    RationalNumber {
      numerator: r.numerator,
      denominator: r.denominator,
    }
  }
}

impl From<NapiExUnits> for ExUnits {
  fn from(u: NapiExUnits) -> Self {
    ExUnits {
      mem: u.mem,
      steps: u.steps,
    }
  }
}

impl From<NapiExUnitPrices> for ExUnitPrices {
  fn from(p: NapiExUnitPrices) -> Self {
    ExUnitPrices {
      mem_price: p.mem_price.into(),
      step_price: p.step_price.into(),
    }
  }
}

fn system_start(ts: i64) -> chrono::DateTime<chrono::FixedOffset> {
  chrono::DateTime::from_timestamp(ts, 0)
    .map(|dt| dt.fixed_offset())
    .unwrap_or_else(|| chrono::DateTime::UNIX_EPOCH.fixed_offset())
}

fn to_nonce(n: Option<NapiNonce>) -> Nonce {
  match n {
    Some(n) => {
      let hash = n.hash.and_then(|h| {
        let bytes = hex::decode(h).ok()?;
        (bytes.len() == 32).then(|| {
          let mut arr = [0u8; 32];
          arr.copy_from_slice(&bytes);
          Hash::<32>::new(arr)
        })
      });
      Nonce {
        variant: match n.variant {
          1 => NonceVariant::Nonce,
          _ => NonceVariant::NeutralNonce,
        },
        hash,
      }
    }
    None => Nonce {
      variant: NonceVariant::NeutralNonce,
      hash: None,
    },
  }
}

impl From<NapiAlonzoBabbageProtParams> for AlonzoProtParams {
  fn from(p: NapiAlonzoBabbageProtParams) -> Self {
    let mut cost_models = BTreeMap::new();
    if let Some(v1) = p.cost_models_for_script_languages.plutus_v1 {
      cost_models.insert(AlonzoLanguage::PlutusV1, v1);
    }

    let (extra_entropy, protocol_version) = (
      to_nonce(p.extra_entropy),
      (p.protocol_version[0], p.protocol_version[1]),
    );

    AlonzoProtParams {
      system_start: system_start(p.system_start),
      epoch_length: p.epoch_length,
      slot_length: p.slot_length,
      minfee_a: p.minfee_a,
      minfee_b: p.minfee_b,
      max_block_body_size: p.max_block_body_size,
      max_transaction_size: p.max_transaction_size,
      max_block_header_size: p.max_block_header_size,
      key_deposit: p.key_deposit,
      pool_deposit: p.pool_deposit,
      desired_number_of_stake_pools: p.desired_number_of_stake_pools,
      protocol_version,
      min_pool_cost: p.min_pool_cost,
      ada_per_utxo_byte: p.ada_per_utxo_byte,
      cost_models_for_script_languages: cost_models,
      execution_costs: p.execution_costs.into(),
      max_tx_ex_units: p.max_tx_ex_units.into(),
      max_block_ex_units: p.max_block_ex_units.into(),
      max_value_size: p.max_value_size,
      collateral_percentage: p.collateral_percentage,
      max_collateral_inputs: p.max_collateral_inputs,
      expansion_rate: p.expansion_rate.into(),
      treasury_growth_rate: p.treasury_growth_rate.into(),
      maximum_epoch: p.maximum_epoch,
      pool_pledge_influence: p.pool_pledge_influence.into(),
      decentralization_constant: p.decentralization_constant.into(),
      extra_entropy,
    }
  }
}

impl From<NapiAlonzoBabbageProtParams> for BabbageProtParams {
  fn from(p: NapiAlonzoBabbageProtParams) -> Self {
    BabbageProtParams {
      system_start: system_start(p.system_start),
      epoch_length: p.epoch_length,
      slot_length: p.slot_length,
      minfee_a: p.minfee_a,
      minfee_b: p.minfee_b,
      max_block_body_size: p.max_block_body_size,
      max_transaction_size: p.max_transaction_size,
      max_block_header_size: p.max_block_header_size,
      key_deposit: p.key_deposit,
      pool_deposit: p.pool_deposit,
      desired_number_of_stake_pools: p.desired_number_of_stake_pools,
      protocol_version: (p.protocol_version[0], p.protocol_version[1]),
      min_pool_cost: p.min_pool_cost,
      ada_per_utxo_byte: p.ada_per_utxo_byte,
      cost_models_for_script_languages: BabbageCostModels {
        plutus_v1: p.cost_models_for_script_languages.plutus_v1,
        plutus_v2: p.cost_models_for_script_languages.plutus_v2,
      },
      execution_costs: p.execution_costs.into(),
      max_tx_ex_units: p.max_tx_ex_units.into(),
      max_block_ex_units: p.max_block_ex_units.into(),
      max_value_size: p.max_value_size,
      collateral_percentage: p.collateral_percentage,
      max_collateral_inputs: p.max_collateral_inputs,
      expansion_rate: p.expansion_rate.into(),
      treasury_growth_rate: p.treasury_growth_rate.into(),
      maximum_epoch: p.maximum_epoch,
      pool_pledge_influence: p.pool_pledge_influence.into(),
      decentralization_constant: p.decentralization_constant.into(),
      extra_entropy: to_nonce(p.extra_entropy),
    }
  }
}

impl From<NapiConwayProtParams> for ConwayProtParams {
  fn from(p: NapiConwayProtParams) -> Self {
    ConwayProtParams {
      system_start: system_start(p.system_start),
      epoch_length: p.epoch_length,
      slot_length: p.slot_length,
      minfee_a: p.minfee_a,
      minfee_b: p.minfee_b,
      max_block_body_size: p.max_block_body_size,
      max_transaction_size: p.max_transaction_size,
      max_block_header_size: p.max_block_header_size,
      key_deposit: p.key_deposit,
      pool_deposit: p.pool_deposit,
      desired_number_of_stake_pools: p.desired_number_of_stake_pools,
      protocol_version: (p.protocol_version[0], p.protocol_version[1]),
      min_pool_cost: p.min_pool_cost,
      ada_per_utxo_byte: p.ada_per_utxo_byte,
      cost_models_for_script_languages: ConwayCostModels {
        plutus_v1: p.cost_models_for_script_languages.plutus_v1,
        plutus_v2: p.cost_models_for_script_languages.plutus_v2,
        plutus_v3: p.cost_models_for_script_languages.plutus_v3,
        unknown: BTreeMap::new(),
      },
      execution_costs: p.execution_costs.into(),
      max_tx_ex_units: p.max_tx_ex_units.into(),
      max_block_ex_units: p.max_block_ex_units.into(),
      max_value_size: p.max_value_size,
      collateral_percentage: p.collateral_percentage,
      max_collateral_inputs: p.max_collateral_inputs,
      expansion_rate: p.expansion_rate.into(),
      treasury_growth_rate: p.treasury_growth_rate.into(),
      maximum_epoch: p.maximum_epoch,
      pool_pledge_influence: p.pool_pledge_influence.into(),
      pool_voting_thresholds: PoolVotingThresholds {
        motion_no_confidence: p.pool_voting_thresholds.motion_no_confidence.into(),
        committee_normal: p.pool_voting_thresholds.committee_normal.into(),
        committee_no_confidence: p.pool_voting_thresholds.committee_no_confidence.into(),
        hard_fork_initiation: p.pool_voting_thresholds.hard_fork_initiation.into(),
        security_voting_threshold: p.pool_voting_thresholds.security_voting_threshold.into(),
      },
      drep_voting_thresholds: DRepVotingThresholds {
        motion_no_confidence: p.drep_voting_thresholds.motion_no_confidence.into(),
        committee_normal: p.drep_voting_thresholds.committee_normal.into(),
        committee_no_confidence: p.drep_voting_thresholds.committee_no_confidence.into(),
        update_constitution: p.drep_voting_thresholds.update_constitution.into(),
        hard_fork_initiation: p.drep_voting_thresholds.hard_fork_initiation.into(),
        pp_network_group: p.drep_voting_thresholds.pp_network_group.into(),
        pp_economic_group: p.drep_voting_thresholds.pp_economic_group.into(),
        pp_technical_group: p.drep_voting_thresholds.pp_technical_group.into(),
        pp_governance_group: p.drep_voting_thresholds.pp_governance_group.into(),
        treasury_withdrawal: p.drep_voting_thresholds.treasury_withdrawal.into(),
      },
      min_committee_size: p.min_committee_size,
      committee_term_limit: p.committee_term_limit,
      governance_action_validity_period: p.governance_action_validity_period,
      governance_action_deposit: p.governance_action_deposit,
      drep_deposit: p.drep_deposit,
      drep_inactivity_period: p.drep_inactivity_period,
      minfee_refscript_cost_per_byte: p.minfee_refscript_cost_per_byte.into(),
    }
  }
}
