use std::collections::BTreeMap;
use std::fmt;

use napi::bindgen_prelude::BigInt;
use pallas::ledger::validate::utils::{AlonzoProtParams, BabbageProtParams, ConwayProtParams};
use pallas_crypto::hash::Hash;
use pallas_primitives::alonzo::{
  ExUnitPrices, ExUnits, Language as AlonzoLanguage, Nonce, NonceVariant, RationalNumber,
};
use pallas_primitives::babbage::CostModels as BabbageCostModels;
use pallas_primitives::conway::{
  CostModels as ConwayCostModels, DRepVotingThresholds, PoolVotingThresholds,
};

#[derive(Debug)]
pub enum PParamsError {
  InvalidU64 { field: String },
  InvalidSystemStart { field: String, value: i64 },
  InvalidNonceHash { field: String, reason: String },
  InvalidProtocolVersion { field: String, reason: String },
}

impl fmt::Display for PParamsError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Self::InvalidU64 { field } => write!(f, "Invalid u64 value for pparams field: {field}"),
      Self::InvalidSystemStart { field, value } => {
        write!(f, "Invalid system_start value {value} for field {field}")
      }
      Self::InvalidNonceHash { field, reason } => {
        write!(f, "Invalid extra_entropy hash for field {field}: {reason}")
      }
      Self::InvalidProtocolVersion { field, reason } => {
        write!(f, "Invalid protocol_version for field {field}: {reason}")
      }
    }
  }
}

impl std::error::Error for PParamsError {}

fn to_u64(field: &str, b: BigInt) -> Result<u64, PParamsError> {
  let (positive, value, lossless) = b.get_u64();
  if !lossless || !positive {
    return Err(PParamsError::InvalidU64 {
      field: field.to_string(),
    });
  }
  Ok(value)
}

fn system_start(
  field: &str,
  ts: i64,
) -> Result<chrono::DateTime<chrono::FixedOffset>, PParamsError> {
  chrono::DateTime::from_timestamp(ts, 0)
    .map(|dt| dt.fixed_offset())
    .ok_or_else(|| PParamsError::InvalidSystemStart {
      field: field.to_string(),
      value: ts,
    })
}

fn to_nonce(field: &str, n: Option<NapiNonce>) -> Result<Nonce, PParamsError> {
  match n {
    None => Ok(Nonce {
      variant: NonceVariant::NeutralNonce,
      hash: None,
    }),
    Some(n) if n.variant != 1 => Ok(Nonce {
      variant: NonceVariant::NeutralNonce,
      hash: None,
    }),
    Some(n) => {
      let hash_str = n.hash.ok_or_else(|| PParamsError::InvalidNonceHash {
        field: field.to_string(),
        reason: "variant is Nonce (1) but hash is missing".to_string(),
      })?;
      let bytes = hex::decode(&hash_str).map_err(|e| PParamsError::InvalidNonceHash {
        field: field.to_string(),
        reason: format!("invalid hex: {e}"),
      })?;
      if bytes.len() != 32 {
        return Err(PParamsError::InvalidNonceHash {
          field: field.to_string(),
          reason: format!("expected 32 bytes, got {}", bytes.len()),
        });
      }
      let mut arr = [0u8; 32];
      arr.copy_from_slice(&bytes);
      Ok(Nonce {
        variant: NonceVariant::Nonce,
        hash: Some(Hash::<32>::new(arr)),
      })
    }
  }
}

fn protocol_version(field: &str, p: Vec<BigInt>) -> Result<(u64, u64), PParamsError> {
  if p.len() != 2 {
    return Err(PParamsError::InvalidProtocolVersion {
      field: field.to_string(),
      reason: format!("expected 2 elements, got {}", p.len()),
    });
  }
  let mut iter = p.into_iter();
  Ok((
    to_u64(&format!("{field}.major"), iter.next().unwrap())?,
    to_u64(&format!("{field}.minor"), iter.next().unwrap())?,
  ))
}

#[napi(object)]
pub struct NapiUnitInterval {
  pub numerator: BigInt,
  pub denominator: BigInt,
}

impl NapiUnitInterval {
  fn try_into_rational(self, field: &str) -> Result<RationalNumber, PParamsError> {
    Ok(RationalNumber {
      numerator: to_u64(&format!("{field}.numerator"), self.numerator)?,
      denominator: to_u64(&format!("{field}.denominator"), self.denominator)?,
    })
  }
}

#[napi(object)]
pub struct NapiExUnits {
  pub mem: BigInt,
  pub steps: BigInt,
}

impl NapiExUnits {
  fn try_into_ex_units(self, field: &str) -> Result<ExUnits, PParamsError> {
    Ok(ExUnits {
      mem: to_u64(&format!("{field}.mem"), self.mem)?,
      steps: to_u64(&format!("{field}.steps"), self.steps)?,
    })
  }
}

#[napi(object)]
pub struct NapiExUnitPrices {
  pub mem_price: NapiUnitInterval,
  pub step_price: NapiUnitInterval,
}

impl NapiExUnitPrices {
  fn try_into_ex_unit_prices(self, field: &str) -> Result<ExUnitPrices, PParamsError> {
    Ok(ExUnitPrices {
      mem_price: self.mem_price.try_into_rational(&format!("{field}.memPrice"))?,
      step_price: self.step_price.try_into_rational(&format!("{field}.stepPrice"))?,
    })
  }
}

#[napi(object)]
pub struct NapiCostModels {
  pub plutus_v1: Option<Vec<i64>>,
  pub plutus_v2: Option<Vec<i64>>,
  pub plutus_v3: Option<Vec<i64>>,
}

impl NapiCostModels {
  fn into_alonzo(self) -> BTreeMap<AlonzoLanguage, Vec<i64>> {
    let mut out = BTreeMap::new();
    if let Some(v1) = self.plutus_v1 {
      out.insert(AlonzoLanguage::PlutusV1, v1);
    }
    out
  }

  fn into_babbage(self) -> BabbageCostModels {
    BabbageCostModels {
      plutus_v1: self.plutus_v1,
      plutus_v2: self.plutus_v2,
    }
  }

  fn into_conway(self) -> ConwayCostModels {
    ConwayCostModels {
      plutus_v1: self.plutus_v1,
      plutus_v2: self.plutus_v2,
      plutus_v3: self.plutus_v3,
      unknown: BTreeMap::new(),
    }
  }
}

#[napi(object)]
pub struct NapiNonce {
  pub variant: u8,
  pub hash: Option<String>,
}

#[napi(object)]
pub struct NapiPoolVotingThresholds {
  pub motion_no_confidence: NapiUnitInterval,
  pub committee_normal: NapiUnitInterval,
  pub committee_no_confidence: NapiUnitInterval,
  pub hard_fork_initiation: NapiUnitInterval,
  pub security_voting_threshold: NapiUnitInterval,
}

impl NapiPoolVotingThresholds {
  fn try_into_pool_voting_thresholds(
    self,
    field: &str,
  ) -> Result<PoolVotingThresholds, PParamsError> {
    Ok(PoolVotingThresholds {
      motion_no_confidence: self
        .motion_no_confidence
        .try_into_rational(&format!("{field}.motionNoConfidence"))?,
      committee_normal: self
        .committee_normal
        .try_into_rational(&format!("{field}.committeeNormal"))?,
      committee_no_confidence: self
        .committee_no_confidence
        .try_into_rational(&format!("{field}.committeeNoConfidence"))?,
      hard_fork_initiation: self
        .hard_fork_initiation
        .try_into_rational(&format!("{field}.hardForkInitiation"))?,
      security_voting_threshold: self
        .security_voting_threshold
        .try_into_rational(&format!("{field}.securityVotingThreshold"))?,
    })
  }
}

#[napi(object)]
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

impl NapiDRepVotingThresholds {
  fn try_into_drep_voting_thresholds(
    self,
    field: &str,
  ) -> Result<DRepVotingThresholds, PParamsError> {
    Ok(DRepVotingThresholds {
      motion_no_confidence: self
        .motion_no_confidence
        .try_into_rational(&format!("{field}.motionNoConfidence"))?,
      committee_normal: self
        .committee_normal
        .try_into_rational(&format!("{field}.committeeNormal"))?,
      committee_no_confidence: self
        .committee_no_confidence
        .try_into_rational(&format!("{field}.committeeNoConfidence"))?,
      update_constitution: self
        .update_constitution
        .try_into_rational(&format!("{field}.updateConstitution"))?,
      hard_fork_initiation: self
        .hard_fork_initiation
        .try_into_rational(&format!("{field}.hardForkInitiation"))?,
      pp_network_group: self
        .pp_network_group
        .try_into_rational(&format!("{field}.ppNetworkGroup"))?,
      pp_economic_group: self
        .pp_economic_group
        .try_into_rational(&format!("{field}.ppEconomicGroup"))?,
      pp_technical_group: self
        .pp_technical_group
        .try_into_rational(&format!("{field}.ppTechnicalGroup"))?,
      pp_governance_group: self
        .pp_governance_group
        .try_into_rational(&format!("{field}.ppGovernanceGroup"))?,
      treasury_withdrawal: self
        .treasury_withdrawal
        .try_into_rational(&format!("{field}.treasuryWithdrawal"))?,
    })
  }
}

/// Union of all protocol-parameter fields for Alonzo, Babbage, and Conway.
/// Pre-Conway eras ignore the Conway-only fields.
#[napi(object)]
pub struct NapiPParams {
  pub system_start: i64,
  pub epoch_length: BigInt,
  pub slot_length: BigInt,
  pub minfee_a: u32,
  pub minfee_b: u32,
  pub max_block_body_size: u32,
  pub max_transaction_size: u32,
  pub max_block_header_size: u32,
  pub key_deposit: BigInt,
  pub pool_deposit: BigInt,
  pub desired_number_of_stake_pools: u32,
  pub protocol_version: Vec<BigInt>,
  pub min_pool_cost: BigInt,
  pub ada_per_utxo_byte: BigInt,
  pub cost_models_for_script_languages: NapiCostModels,
  pub execution_costs: NapiExUnitPrices,
  pub max_tx_ex_units: NapiExUnits,
  pub max_block_ex_units: NapiExUnits,
  pub max_value_size: u32,
  pub collateral_percentage: u32,
  pub max_collateral_inputs: u32,
  pub expansion_rate: NapiUnitInterval,
  pub treasury_growth_rate: NapiUnitInterval,
  pub maximum_epoch: BigInt,
  pub pool_pledge_influence: NapiUnitInterval,
  pub decentralization_constant: NapiUnitInterval,
  pub extra_entropy: Option<NapiNonce>,
  pub pool_voting_thresholds: NapiPoolVotingThresholds,
  pub drep_voting_thresholds: NapiDRepVotingThresholds,
  pub min_committee_size: BigInt,
  pub committee_term_limit: BigInt,
  pub governance_action_validity_period: BigInt,
  pub governance_action_deposit: BigInt,
  pub drep_deposit: BigInt,
  pub drep_inactivity_period: BigInt,
  pub minfee_refscript_cost_per_byte: NapiUnitInterval,
}

impl TryFrom<NapiPParams> for AlonzoProtParams {
  type Error = PParamsError;
  fn try_from(p: NapiPParams) -> Result<Self, Self::Error> {
    Ok(AlonzoProtParams {
      system_start: system_start("systemStart", p.system_start)?,
      epoch_length: to_u64("epochLength", p.epoch_length)?,
      slot_length: to_u64("slotLength", p.slot_length)?,
      minfee_a: p.minfee_a,
      minfee_b: p.minfee_b,
      max_block_body_size: p.max_block_body_size,
      max_transaction_size: p.max_transaction_size,
      max_block_header_size: p.max_block_header_size,
      key_deposit: to_u64("keyDeposit", p.key_deposit)?,
      pool_deposit: to_u64("poolDeposit", p.pool_deposit)?,
      desired_number_of_stake_pools: p.desired_number_of_stake_pools,
      protocol_version: protocol_version("protocolVersion", p.protocol_version)?,
      min_pool_cost: to_u64("minPoolCost", p.min_pool_cost)?,
      ada_per_utxo_byte: to_u64("adaPerUtxoByte", p.ada_per_utxo_byte)?,
      cost_models_for_script_languages: p.cost_models_for_script_languages.into_alonzo(),
      execution_costs: p.execution_costs.try_into_ex_unit_prices("executionCosts")?,
      max_tx_ex_units: p.max_tx_ex_units.try_into_ex_units("maxTxExUnits")?,
      max_block_ex_units: p.max_block_ex_units.try_into_ex_units("maxBlockExUnits")?,
      max_value_size: p.max_value_size,
      collateral_percentage: p.collateral_percentage,
      max_collateral_inputs: p.max_collateral_inputs,
      expansion_rate: p.expansion_rate.try_into_rational("expansionRate")?,
      treasury_growth_rate: p
        .treasury_growth_rate
        .try_into_rational("treasuryGrowthRate")?,
      maximum_epoch: to_u64("maximumEpoch", p.maximum_epoch)?,
      pool_pledge_influence: p
        .pool_pledge_influence
        .try_into_rational("poolPledgeInfluence")?,
      decentralization_constant: p
        .decentralization_constant
        .try_into_rational("decentralizationConstant")?,
      extra_entropy: to_nonce("extraEntropy", p.extra_entropy)?,
    })
  }
}

impl TryFrom<NapiPParams> for BabbageProtParams {
  type Error = PParamsError;
  fn try_from(p: NapiPParams) -> Result<Self, Self::Error> {
    Ok(BabbageProtParams {
      system_start: system_start("systemStart", p.system_start)?,
      epoch_length: to_u64("epochLength", p.epoch_length)?,
      slot_length: to_u64("slotLength", p.slot_length)?,
      minfee_a: p.minfee_a,
      minfee_b: p.minfee_b,
      max_block_body_size: p.max_block_body_size,
      max_transaction_size: p.max_transaction_size,
      max_block_header_size: p.max_block_header_size,
      key_deposit: to_u64("keyDeposit", p.key_deposit)?,
      pool_deposit: to_u64("poolDeposit", p.pool_deposit)?,
      desired_number_of_stake_pools: p.desired_number_of_stake_pools,
      protocol_version: protocol_version("protocolVersion", p.protocol_version)?,
      min_pool_cost: to_u64("minPoolCost", p.min_pool_cost)?,
      ada_per_utxo_byte: to_u64("adaPerUtxoByte", p.ada_per_utxo_byte)?,
      cost_models_for_script_languages: p.cost_models_for_script_languages.into_babbage(),
      execution_costs: p.execution_costs.try_into_ex_unit_prices("executionCosts")?,
      max_tx_ex_units: p.max_tx_ex_units.try_into_ex_units("maxTxExUnits")?,
      max_block_ex_units: p.max_block_ex_units.try_into_ex_units("maxBlockExUnits")?,
      max_value_size: p.max_value_size,
      collateral_percentage: p.collateral_percentage,
      max_collateral_inputs: p.max_collateral_inputs,
      expansion_rate: p.expansion_rate.try_into_rational("expansionRate")?,
      treasury_growth_rate: p
        .treasury_growth_rate
        .try_into_rational("treasuryGrowthRate")?,
      maximum_epoch: to_u64("maximumEpoch", p.maximum_epoch)?,
      pool_pledge_influence: p
        .pool_pledge_influence
        .try_into_rational("poolPledgeInfluence")?,
      decentralization_constant: p
        .decentralization_constant
        .try_into_rational("decentralizationConstant")?,
      extra_entropy: to_nonce("extraEntropy", p.extra_entropy)?,
    })
  }
}

impl TryFrom<NapiPParams> for ConwayProtParams {
  type Error = PParamsError;
  fn try_from(p: NapiPParams) -> Result<Self, Self::Error> {
    Ok(ConwayProtParams {
      system_start: system_start("systemStart", p.system_start)?,
      epoch_length: to_u64("epochLength", p.epoch_length)?,
      slot_length: to_u64("slotLength", p.slot_length)?,
      minfee_a: p.minfee_a,
      minfee_b: p.minfee_b,
      max_block_body_size: p.max_block_body_size,
      max_transaction_size: p.max_transaction_size,
      max_block_header_size: p.max_block_header_size,
      key_deposit: to_u64("keyDeposit", p.key_deposit)?,
      pool_deposit: to_u64("poolDeposit", p.pool_deposit)?,
      desired_number_of_stake_pools: p.desired_number_of_stake_pools,
      protocol_version: protocol_version("protocolVersion", p.protocol_version)?,
      min_pool_cost: to_u64("minPoolCost", p.min_pool_cost)?,
      ada_per_utxo_byte: to_u64("adaPerUtxoByte", p.ada_per_utxo_byte)?,
      cost_models_for_script_languages: p.cost_models_for_script_languages.into_conway(),
      execution_costs: p.execution_costs.try_into_ex_unit_prices("executionCosts")?,
      max_tx_ex_units: p.max_tx_ex_units.try_into_ex_units("maxTxExUnits")?,
      max_block_ex_units: p.max_block_ex_units.try_into_ex_units("maxBlockExUnits")?,
      max_value_size: p.max_value_size,
      collateral_percentage: p.collateral_percentage,
      max_collateral_inputs: p.max_collateral_inputs,
      expansion_rate: p.expansion_rate.try_into_rational("expansionRate")?,
      treasury_growth_rate: p
        .treasury_growth_rate
        .try_into_rational("treasuryGrowthRate")?,
      maximum_epoch: to_u64("maximumEpoch", p.maximum_epoch)?,
      pool_pledge_influence: p
        .pool_pledge_influence
        .try_into_rational("poolPledgeInfluence")?,
      pool_voting_thresholds: p
        .pool_voting_thresholds
        .try_into_pool_voting_thresholds("poolVotingThresholds")?,
      drep_voting_thresholds: p
        .drep_voting_thresholds
        .try_into_drep_voting_thresholds("drepVotingThresholds")?,
      min_committee_size: to_u64("minCommitteeSize", p.min_committee_size)?,
      committee_term_limit: to_u64("committeeTermLimit", p.committee_term_limit)?,
      governance_action_validity_period: to_u64(
        "governanceActionValidityPeriod",
        p.governance_action_validity_period,
      )?,
      governance_action_deposit: to_u64(
        "governanceActionDeposit",
        p.governance_action_deposit,
      )?,
      drep_deposit: to_u64("drepDeposit", p.drep_deposit)?,
      drep_inactivity_period: to_u64("drepInactivityPeriod", p.drep_inactivity_period)?,
      minfee_refscript_cost_per_byte: p
        .minfee_refscript_cost_per_byte
        .try_into_rational("minfeeRefscriptCostPerByte")?,
    })
  }
}
