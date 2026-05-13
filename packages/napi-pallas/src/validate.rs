use std::collections::{BTreeMap, HashMap};
use std::str::FromStr;

use pallas::ledger::traverse::{Era, MultiEraInput, MultiEraOutput, MultiEraTx};
use pallas::ledger::validate::phase1::alonzo::validate_alonzo_tx;
use pallas::ledger::validate::phase1::babbage::validate_babbage_tx;
use pallas::ledger::validate::phase1::conway::validate_conway_tx;
use pallas::ledger::validate::utils::{
  AlonzoError, AlonzoProtParams, BabbageProtParams, ConwayProtParams, PostAlonzoError,
  ValidationError, UTxOs,
};
use pallas_crypto::hash::Hash;
use pallas_primitives::alonzo::{
  ExUnitPrices, ExUnits, Language as AlonzoLanguage, Nonce, NonceVariant, RationalNumber,
  TransactionInput,
};
use pallas_primitives::babbage::CostModels as BabbageCostModels;
use pallas_primitives::conway::{
  CostModels as ConwayCostModels, DRepVotingThresholds, PoolVotingThresholds,
};
use serde::Deserialize;

use crate::Utxo;

#[napi(object)]
pub struct ValidationCheck {
  pub rule: String,
  pub passed: bool,
  pub error: Option<String>,
}

#[napi(object)]
pub struct ValidationResponse {
  pub era: String,
  pub checks: Vec<ValidationCheck>,
  pub valid: bool,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiUnitInterval {
  numerator: u64,
  denominator: u64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiExUnits {
  mem: u64,
  steps: u64,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiExUnitPrices {
  mem_price: NapiUnitInterval,
  step_price: NapiUnitInterval,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiCostModels {
  plutus_v1: Option<Vec<i64>>,
  plutus_v2: Option<Vec<i64>>,
  plutus_v3: Option<Vec<i64>>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiNonce {
  variant: u8,
  hash: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiPoolVotingThresholds {
  motion_no_confidence: NapiUnitInterval,
  committee_normal: NapiUnitInterval,
  committee_no_confidence: NapiUnitInterval,
  hard_fork_initiation: NapiUnitInterval,
  security_voting_threshold: NapiUnitInterval,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiDRepVotingThresholds {
  motion_no_confidence: NapiUnitInterval,
  committee_normal: NapiUnitInterval,
  committee_no_confidence: NapiUnitInterval,
  update_constitution: NapiUnitInterval,
  hard_fork_initiation: NapiUnitInterval,
  pp_network_group: NapiUnitInterval,
  pp_economic_group: NapiUnitInterval,
  pp_technical_group: NapiUnitInterval,
  pp_governance_group: NapiUnitInterval,
  treasury_withdrawal: NapiUnitInterval,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiAlonzoProtParams {
  system_start: i64,
  epoch_length: u64,
  slot_length: u64,
  minfee_a: u32,
  minfee_b: u32,
  max_block_body_size: u32,
  max_transaction_size: u32,
  max_block_header_size: u32,
  key_deposit: u64,
  pool_deposit: u64,
  desired_number_of_stake_pools: u32,
  protocol_version: [u64; 2],
  min_pool_cost: u64,
  ada_per_utxo_byte: u64,
  cost_models_for_script_languages: NapiCostModels,
  execution_costs: NapiExUnitPrices,
  max_tx_ex_units: NapiExUnits,
  max_block_ex_units: NapiExUnits,
  max_value_size: u32,
  collateral_percentage: u32,
  max_collateral_inputs: u32,
  expansion_rate: NapiUnitInterval,
  treasury_growth_rate: NapiUnitInterval,
  maximum_epoch: u64,
  pool_pledge_influence: NapiUnitInterval,
  decentralization_constant: NapiUnitInterval,
  #[serde(default)]
  extra_entropy: Option<NapiNonce>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiBabbageProtParams {
  system_start: i64,
  epoch_length: u64,
  slot_length: u64,
  minfee_a: u32,
  minfee_b: u32,
  max_block_body_size: u32,
  max_transaction_size: u32,
  max_block_header_size: u32,
  key_deposit: u64,
  pool_deposit: u64,
  desired_number_of_stake_pools: u32,
  protocol_version: [u64; 2],
  min_pool_cost: u64,
  ada_per_utxo_byte: u64,
  cost_models_for_script_languages: NapiCostModels,
  execution_costs: NapiExUnitPrices,
  max_tx_ex_units: NapiExUnits,
  max_block_ex_units: NapiExUnits,
  max_value_size: u32,
  collateral_percentage: u32,
  max_collateral_inputs: u32,
  expansion_rate: NapiUnitInterval,
  treasury_growth_rate: NapiUnitInterval,
  maximum_epoch: u64,
  pool_pledge_influence: NapiUnitInterval,
  decentralization_constant: NapiUnitInterval,
  #[serde(default)]
  extra_entropy: Option<NapiNonce>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct NapiConwayProtParams {
  system_start: i64,
  epoch_length: u64,
  slot_length: u64,
  minfee_a: u32,
  minfee_b: u32,
  max_block_body_size: u32,
  max_transaction_size: u32,
  max_block_header_size: u32,
  key_deposit: u64,
  pool_deposit: u64,
  desired_number_of_stake_pools: u32,
  protocol_version: [u64; 2],
  min_pool_cost: u64,
  ada_per_utxo_byte: u64,
  cost_models_for_script_languages: NapiCostModels,
  execution_costs: NapiExUnitPrices,
  max_tx_ex_units: NapiExUnits,
  max_block_ex_units: NapiExUnits,
  max_value_size: u32,
  collateral_percentage: u32,
  max_collateral_inputs: u32,
  expansion_rate: NapiUnitInterval,
  treasury_growth_rate: NapiUnitInterval,
  maximum_epoch: u64,
  pool_pledge_influence: NapiUnitInterval,
  pool_voting_thresholds: NapiPoolVotingThresholds,
  drep_voting_thresholds: NapiDRepVotingThresholds,
  min_committee_size: u64,
  committee_term_limit: u64,
  governance_action_validity_period: u64,
  governance_action_deposit: u64,
  drep_deposit: u64,
  drep_inactivity_period: u64,
  minfee_refscript_cost_per_byte: NapiUnitInterval,
}

fn to_rational(r: NapiUnitInterval) -> RationalNumber {
  RationalNumber {
    numerator: r.numerator,
    denominator: r.denominator,
  }
}

fn to_ex_units(u: NapiExUnits) -> ExUnits {
  ExUnits {
    mem: u.mem,
    steps: u.steps,
  }
}

fn to_ex_unit_prices(p: NapiExUnitPrices) -> ExUnitPrices {
  ExUnitPrices {
    mem_price: to_rational(p.mem_price),
    step_price: to_rational(p.step_price),
  }
}

fn system_start(ts: i64) -> chrono::DateTime<chrono::FixedOffset> {
  chrono::DateTime::from_timestamp(ts, 0)
    .expect("valid timestamp")
    .fixed_offset()
}

fn to_nonce(n: Option<NapiNonce>) -> Nonce {
  match n {
    Some(n) => {
      let hash = n.hash.map(|h| {
        let bytes = hex::decode(h).expect("invalid nonce hash hex");
        let mut arr = [0u8; 32];
        arr.copy_from_slice(&bytes);
        Hash::<32>::new(arr)
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

impl NapiAlonzoProtParams {
  fn into_pallas(self) -> AlonzoProtParams {
    let mut cost_models = BTreeMap::new();
    if let Some(v1) = self.cost_models_for_script_languages.plutus_v1 {
      cost_models.insert(AlonzoLanguage::PlutusV1, v1);
    }

    let (extra_entropy, protocol_version) = (
      to_nonce(self.extra_entropy),
      (self.protocol_version[0], self.protocol_version[1]),
    );

    AlonzoProtParams {
      system_start: system_start(self.system_start),
      epoch_length: self.epoch_length,
      slot_length: self.slot_length,
      minfee_a: self.minfee_a,
      minfee_b: self.minfee_b,
      max_block_body_size: self.max_block_body_size,
      max_transaction_size: self.max_transaction_size,
      max_block_header_size: self.max_block_header_size,
      key_deposit: self.key_deposit,
      pool_deposit: self.pool_deposit,
      desired_number_of_stake_pools: self.desired_number_of_stake_pools,
      protocol_version,
      min_pool_cost: self.min_pool_cost,
      ada_per_utxo_byte: self.ada_per_utxo_byte,
      cost_models_for_script_languages: cost_models,
      execution_costs: to_ex_unit_prices(self.execution_costs),
      max_tx_ex_units: to_ex_units(self.max_tx_ex_units),
      max_block_ex_units: to_ex_units(self.max_block_ex_units),
      max_value_size: self.max_value_size,
      collateral_percentage: self.collateral_percentage,
      max_collateral_inputs: self.max_collateral_inputs,
      expansion_rate: to_rational(self.expansion_rate),
      treasury_growth_rate: to_rational(self.treasury_growth_rate),
      maximum_epoch: self.maximum_epoch,
      pool_pledge_influence: to_rational(self.pool_pledge_influence),
      decentralization_constant: to_rational(self.decentralization_constant),
      extra_entropy,
    }
  }
}

impl NapiBabbageProtParams {
  fn into_pallas(self) -> BabbageProtParams {
    BabbageProtParams {
      system_start: system_start(self.system_start),
      epoch_length: self.epoch_length,
      slot_length: self.slot_length,
      minfee_a: self.minfee_a,
      minfee_b: self.minfee_b,
      max_block_body_size: self.max_block_body_size,
      max_transaction_size: self.max_transaction_size,
      max_block_header_size: self.max_block_header_size,
      key_deposit: self.key_deposit,
      pool_deposit: self.pool_deposit,
      desired_number_of_stake_pools: self.desired_number_of_stake_pools,
      protocol_version: (self.protocol_version[0], self.protocol_version[1]),
      min_pool_cost: self.min_pool_cost,
      ada_per_utxo_byte: self.ada_per_utxo_byte,
      cost_models_for_script_languages: BabbageCostModels {
        plutus_v1: self.cost_models_for_script_languages.plutus_v1,
        plutus_v2: self.cost_models_for_script_languages.plutus_v2,
      },
      execution_costs: to_ex_unit_prices(self.execution_costs),
      max_tx_ex_units: to_ex_units(self.max_tx_ex_units),
      max_block_ex_units: to_ex_units(self.max_block_ex_units),
      max_value_size: self.max_value_size,
      collateral_percentage: self.collateral_percentage,
      max_collateral_inputs: self.max_collateral_inputs,
      expansion_rate: to_rational(self.expansion_rate),
      treasury_growth_rate: to_rational(self.treasury_growth_rate),
      maximum_epoch: self.maximum_epoch,
      pool_pledge_influence: to_rational(self.pool_pledge_influence),
      decentralization_constant: to_rational(self.decentralization_constant),
      extra_entropy: to_nonce(self.extra_entropy),
    }
  }
}

impl NapiConwayProtParams {
  fn into_pallas(self) -> ConwayProtParams {
    ConwayProtParams {
      system_start: system_start(self.system_start),
      epoch_length: self.epoch_length,
      slot_length: self.slot_length,
      minfee_a: self.minfee_a,
      minfee_b: self.minfee_b,
      max_block_body_size: self.max_block_body_size,
      max_transaction_size: self.max_transaction_size,
      max_block_header_size: self.max_block_header_size,
      key_deposit: self.key_deposit,
      pool_deposit: self.pool_deposit,
      desired_number_of_stake_pools: self.desired_number_of_stake_pools,
      protocol_version: (self.protocol_version[0], self.protocol_version[1]),
      min_pool_cost: self.min_pool_cost,
      ada_per_utxo_byte: self.ada_per_utxo_byte,
      cost_models_for_script_languages: ConwayCostModels {
        plutus_v1: self.cost_models_for_script_languages.plutus_v1,
        plutus_v2: self.cost_models_for_script_languages.plutus_v2,
        plutus_v3: self.cost_models_for_script_languages.plutus_v3,
        unknown: BTreeMap::new(),
      },
      execution_costs: ExUnitPrices {
        mem_price: to_rational(self.execution_costs.mem_price),
        step_price: to_rational(self.execution_costs.step_price),
      },
      max_tx_ex_units: to_ex_units(self.max_tx_ex_units),
      max_block_ex_units: to_ex_units(self.max_block_ex_units),
      max_value_size: self.max_value_size,
      collateral_percentage: self.collateral_percentage,
      max_collateral_inputs: self.max_collateral_inputs,
      expansion_rate: to_rational(self.expansion_rate),
      treasury_growth_rate: to_rational(self.treasury_growth_rate),
      maximum_epoch: self.maximum_epoch,
      pool_pledge_influence: to_rational(self.pool_pledge_influence),
      pool_voting_thresholds: PoolVotingThresholds {
        motion_no_confidence: to_rational(
          self.pool_voting_thresholds.motion_no_confidence,
        ),
        committee_normal: to_rational(self.pool_voting_thresholds.committee_normal),
        committee_no_confidence: to_rational(
          self.pool_voting_thresholds.committee_no_confidence,
        ),
        hard_fork_initiation: to_rational(
          self.pool_voting_thresholds.hard_fork_initiation,
        ),
        security_voting_threshold: to_rational(
          self.pool_voting_thresholds.security_voting_threshold,
        ),
      },
      drep_voting_thresholds: DRepVotingThresholds {
        motion_no_confidence: to_rational(
          self.drep_voting_thresholds.motion_no_confidence,
        ),
        committee_normal: to_rational(self.drep_voting_thresholds.committee_normal),
        committee_no_confidence: to_rational(
          self.drep_voting_thresholds.committee_no_confidence,
        ),
        update_constitution: to_rational(
          self.drep_voting_thresholds.update_constitution,
        ),
        hard_fork_initiation: to_rational(
          self.drep_voting_thresholds.hard_fork_initiation,
        ),
        pp_network_group: to_rational(self.drep_voting_thresholds.pp_network_group),
        pp_economic_group: to_rational(self.drep_voting_thresholds.pp_economic_group),
        pp_technical_group: to_rational(self.drep_voting_thresholds.pp_technical_group),
        pp_governance_group: to_rational(
          self.drep_voting_thresholds.pp_governance_group,
        ),
        treasury_withdrawal: to_rational(
          self.drep_voting_thresholds.treasury_withdrawal,
        ),
      },
      min_committee_size: self.min_committee_size,
      committee_term_limit: self.committee_term_limit,
      governance_action_validity_period: self.governance_action_validity_period,
      governance_action_deposit: self.governance_action_deposit,
      drep_deposit: self.drep_deposit,
      drep_inactivity_period: self.drep_inactivity_period,
      minfee_refscript_cost_per_byte: to_rational(
        self.minfee_refscript_cost_per_byte,
      ),
    }
  }
}

fn build_utxos_for_era<'a>(
  era: &Era,
  utxos: &[Utxo],
  cbor_list: &'a mut Vec<Vec<u8>>,
) -> Result<UTxOs<'a>, String> {
  for utxo in utxos {
    let cbor = hex::decode(&utxo.bytes)
      .map_err(|e| format!("Failed to decode utxo bytes hex: {}", e))?;
    cbor_list.push(cbor);
  }

  let mut map: UTxOs = HashMap::new();

  for (utxo, cbor) in utxos.iter().zip(cbor_list.iter()) {
    let tx_hash = Hash::<32>::from_str(&utxo.tx_hash)
      .map_err(|_| format!("Invalid tx hash: {}", utxo.tx_hash))?;
    let multi_era_in = MultiEraInput::AlonzoCompatible(Box::new(std::borrow::Cow::Owned(
      TransactionInput {
        transaction_id: tx_hash,
        index: utxo.index as u64,
      },
    )));

    let decode_eras = match era {
      Era::Conway => vec![Era::Conway, Era::Babbage, Era::Alonzo],
      Era::Babbage => vec![Era::Babbage, Era::Alonzo],
      Era::Alonzo => vec![Era::Alonzo],
      _ => vec![Era::Conway, Era::Babbage, Era::Alonzo],
    };

    let mut decoded = false;
    for try_era in &decode_eras {
      if let Ok(out) = MultiEraOutput::decode(*try_era, cbor) {
        map.insert(multi_era_in.clone(), out);
        decoded = true;
        break;
      }
    }

    if !decoded {
      return Err(format!(
        "Failed to decode UTxO {}#{}",
        utxo.tx_hash, utxo.index
      ));
    }
  }

  Ok(map)
}

type ErrorMatcher = fn(&ValidationError) -> bool;

macro_rules! post_alonzo_matcher {
  ($($variant:ident),* $(,)?) => {
    |e: &ValidationError| {
      if let ValidationError::PostAlonzo(inner) = e {
        $(
          if matches!(inner, PostAlonzoError::$variant) { return true; }
        )*
      }
      false
    }
  };
}

macro_rules! alonzo_matcher {
  ($($variant:ident),* $(,)?) => {
    |e: &ValidationError| {
      if let ValidationError::Alonzo(inner) = e {
        $(
          if matches!(inner, AlonzoError::$variant) { return true; }
        )*
      }
      false
    }
  };
}

fn never_match(_: &ValidationError) -> bool {
  false
}

fn check_minting_policy_error(e: &ValidationError) -> bool {
  matches!(e, ValidationError::PostAlonzo(PostAlonzoError::MintingLacksPolicy(_)))
}

static CONWAY_CHECKS: &[(&str, ErrorMatcher)] = &[
  ("check_ins_not_empty", post_alonzo_matcher!(TxInsEmpty)),
  (
    "check_all_ins_in_utxos",
    post_alonzo_matcher!(InputNotInUTxO, CollateralNotInUTxO, ReferenceInputNotInUTxO),
  ),
  (
    "check_tx_validity_interval",
    post_alonzo_matcher!(BlockPrecedesValInt, BlockExceedsValInt),
  ),
  (
    "check_fee",
    post_alonzo_matcher!(
      FeeBelowMin,
      CollateralMissing,
      TooManyCollaterals,
      CollateralNotVKeyLocked,
      CollateralMinLovelace,
      NonLovelaceCollateral,
      CollateralWrongAssets,
      CollateralAnnotation,
      AddressDecoding,
      InputDecoding
    ),
  ),
  (
    "check_preservation_of_value",
    post_alonzo_matcher!(PreservationOfValue, NegativeValue),
  ),
  (
    "check_min_lovelace",
    post_alonzo_matcher!(MinLovelaceUnreached),
  ),
  (
    "check_output_val_size",
    post_alonzo_matcher!(MaxValSizeExceeded),
  ),
  (
    "check_network_id",
    post_alonzo_matcher!(OutputWrongNetworkID, TxWrongNetworkID),
  ),
  (
    "check_tx_size",
    post_alonzo_matcher!(MaxTxSizeExceeded),
  ),
  (
    "check_tx_ex_units",
    post_alonzo_matcher!(TxExUnitsExceeded),
  ),
  (
    "check_minting",
    check_minting_policy_error,
  ),
  (
    "check_well_formedness",
    post_alonzo_matcher!(RedeemerMissing, UnneededRedeemer, DatumMissing, UnneededDatum),
  ),
  (
    "check_witness_set",
    post_alonzo_matcher!(
      ScriptWitnessMissing,
      VKWitnessMissing,
      VKWrongSignature,
      ReqSignerMissing,
      ReqSignerWrongSig,
      UnneededNativeScript,
      UnneededPlutusV1Script,
      UnneededPlutusV2Script,
      UnneededPlutusV3Script
    ),
  ),
  (
    "check_languages",
    post_alonzo_matcher!(UnsupportedPlutusLanguage),
  ),
  (
    "check_auxiliary_data",
    post_alonzo_matcher!(MetadataHash),
  ),
  (
    "check_script_data_hash",
    post_alonzo_matcher!(ScriptIntegrityHash),
  ),
];

static BABBAGE_CHECKS: &[(&str, ErrorMatcher)] = &[
  ("check_ins_not_empty", post_alonzo_matcher!(TxInsEmpty)),
  (
    "check_all_ins_in_utxos",
    post_alonzo_matcher!(InputNotInUTxO, CollateralNotInUTxO, ReferenceInputNotInUTxO),
  ),
  (
    "check_tx_validity_interval",
    post_alonzo_matcher!(BlockPrecedesValInt, BlockExceedsValInt),
  ),
  (
    "check_fee",
    post_alonzo_matcher!(
      FeeBelowMin,
      CollateralMissing,
      TooManyCollaterals,
      CollateralNotVKeyLocked,
      CollateralMinLovelace,
      NonLovelaceCollateral,
      CollateralWrongAssets,
      CollateralAnnotation,
      AddressDecoding,
      InputDecoding
    ),
  ),
  (
    "check_preservation_of_value",
    post_alonzo_matcher!(PreservationOfValue, NegativeValue),
  ),
  (
    "check_min_lovelace",
    post_alonzo_matcher!(MinLovelaceUnreached),
  ),
  (
    "check_output_val_size",
    post_alonzo_matcher!(MaxValSizeExceeded),
  ),
  (
    "check_network_id",
    post_alonzo_matcher!(OutputWrongNetworkID, TxWrongNetworkID),
  ),
  (
    "check_tx_size",
    post_alonzo_matcher!(MaxTxSizeExceeded),
  ),
  (
    "check_tx_ex_units",
    post_alonzo_matcher!(TxExUnitsExceeded),
  ),
  (
    "check_minting",
    check_minting_policy_error,
  ),
  (
    "check_well_formedness",
    post_alonzo_matcher!(RedeemerMissing, UnneededRedeemer, DatumMissing, UnneededDatum),
  ),
  (
    "check_witness_set",
    post_alonzo_matcher!(
      ScriptWitnessMissing,
      VKWitnessMissing,
      VKWrongSignature,
      ReqSignerMissing,
      ReqSignerWrongSig,
      UnneededNativeScript,
      UnneededPlutusV1Script,
      UnneededPlutusV2Script,
      UnneededPlutusV3Script
    ),
  ),
  (
    "check_languages",
    post_alonzo_matcher!(UnsupportedPlutusLanguage),
  ),
  (
    "check_auxiliary_data",
    post_alonzo_matcher!(MetadataHash),
  ),
  (
    "check_script_data_hash",
    post_alonzo_matcher!(ScriptIntegrityHash),
  ),
];

static ALONZO_CHECKS: &[(&str, ErrorMatcher)] = &[
  ("check_ins_not_empty", alonzo_matcher!(TxInsEmpty)),
  (
    "check_ins_and_collateral_in_utxos",
    alonzo_matcher!(InputNotInUTxO, CollateralNotInUTxO),
  ),
  (
    "check_tx_validity_interval",
    alonzo_matcher!(BlockPrecedesValInt, BlockExceedsValInt, ValIntUpperBoundMissing),
  ),
  (
    "check_fee",
    alonzo_matcher!(
      FeeBelowMin,
      CollateralMissing,
      TooManyCollaterals,
      CollateralNotVKeyLocked,
      CollateralMinLovelace,
      NonLovelaceCollateral,
      AddressDecoding
    ),
  ),
  (
    "check_preservation_of_value",
    alonzo_matcher!(PreservationOfValue, NegativeValue),
  ),
  (
    "check_min_lovelace",
    alonzo_matcher!(MinLovelaceUnreached),
  ),
  (
    "check_output_val_size",
    alonzo_matcher!(MaxValSizeExceeded),
  ),
  (
    "check_network_id",
    alonzo_matcher!(OutputWrongNetworkID, TxWrongNetworkID),
  ),
  (
    "check_tx_size",
    alonzo_matcher!(MaxTxSizeExceeded),
  ),
  (
    "check_tx_ex_units",
    alonzo_matcher!(TxExUnitsExceeded),
  ),
  (
    "check_witness_set",
    alonzo_matcher!(
      ScriptWitnessMissing,
      VKWitnessMissing,
      VKWrongSignature,
      ReqSignerMissing,
      ReqSignerWrongSig,
      UnneededNativeScript,
      UnneededPlutusScript,
      UnneededRedeemer
    ),
  ),
  ("check_languages", never_match),
  (
    "check_auxiliary_data",
    alonzo_matcher!(MetadataHash),
  ),
  (
    "check_script_data_hash",
    alonzo_matcher!(ScriptIntegrityHash),
  ),
  (
    "check_minting",
    alonzo_matcher!(MintingLacksPolicy),
  ),
];

fn build_checks_from_error(
  checks: &[(&str, ErrorMatcher)],
  error: &ValidationError,
) -> Vec<ValidationCheck> {
  let mut results = Vec::with_capacity(checks.len());

  for &(name, matcher) in checks {
    if matcher(error) {
      results.push(ValidationCheck {
        rule: name.to_string(),
        passed: false,
        error: Some(error.to_string()),
      });
      break;
    }
    results.push(ValidationCheck {
      rule: name.to_string(),
      passed: true,
      error: None,
    });
  }

  while results.len() < checks.len() {
    let name = checks[results.len()].0;
    results.push(ValidationCheck {
      rule: name.to_string(),
      passed: false,
      error: Some("skipped".to_string()),
    });
  }

  results
}

fn build_all_passed(checks: &[(&str, ErrorMatcher)]) -> Vec<ValidationCheck> {
  checks
    .iter()
    .map(|&(name, _)| ValidationCheck {
      rule: name.to_string(),
      passed: true,
      error: None,
    })
    .collect()
}

fn unsupported_era_response(era: &str) -> ValidationResponse {
  ValidationResponse {
    era: era.to_string(),
    checks: vec![ValidationCheck {
      rule: "unsupported_era".to_string(),
      passed: false,
      error: Some(format!("Era {} is not supported for validation", era)),
    }],
    valid: false,
  }
}

#[napi]
pub fn validate_cbor_tx(
  cbor: String,
  utxos: Vec<Utxo>,
  pparams_json: String,
  slot: u32,
  network_id: u8,
  network_magic: u32,
) -> ValidationResponse {
  let slot_u64 = slot as u64;
  let cbor_bytes = match hex::decode(&cbor) {
    Ok(b) => b,
    Err(e) => {
      return ValidationResponse {
        era: "unknown".to_string(),
        checks: vec![ValidationCheck {
          rule: "decode".to_string(),
          passed: false,
          error: Some(format!("Failed to decode hex: {}", e)),
        }],
        valid: false,
      }
    }
  };

  let metx = match MultiEraTx::decode(&cbor_bytes) {
    Ok(tx) => tx,
    Err(e) => {
      return ValidationResponse {
        era: "unknown".to_string(),
        checks: vec![ValidationCheck {
          rule: "decode".to_string(),
          passed: false,
          error: Some(format!("Failed to decode tx CBOR: {}", e)),
        }],
        valid: false,
      }
    }
  };

  match &metx {
    MultiEraTx::Conway(x) => {
      let era = Era::Conway;
      let mut cbor_list = Vec::with_capacity(utxos.len());
      let utxos_map = match build_utxos_for_era(&era, &utxos, &mut cbor_list) {
        Ok(u) => u,
        Err(e) => {
          return ValidationResponse {
            era: "conway".to_string(),
            checks: vec![ValidationCheck {
              rule: "decode".to_string(),
              passed: false,
              error: Some(e),
            }],
            valid: false,
          }
        }
      };

      let pparams: NapiConwayProtParams = match serde_json::from_str(&pparams_json) {
        Ok(p) => p,
        Err(e) => {
          return ValidationResponse {
            era: "conway".to_string(),
            checks: vec![ValidationCheck {
              rule: "params".to_string(),
              passed: false,
              error: Some(format!("Failed to parse Conway params: {}", e)),
            }],
            valid: false,
          }
        }
      };
      let conway_pps = pparams.into_pallas();

      match validate_conway_tx(&***x, &utxos_map, &conway_pps, &slot_u64, &network_id) {
        Ok(()) => ValidationResponse {
          era: "conway".to_string(),
          checks: build_all_passed(CONWAY_CHECKS),
          valid: true,
        },
        Err(e) => ValidationResponse {
          era: "conway".to_string(),
          checks: build_checks_from_error(CONWAY_CHECKS, &e),
          valid: false,
        },
      }
    }
    MultiEraTx::Babbage(x) => {
      let era = Era::Babbage;
      let mut cbor_list = Vec::with_capacity(utxos.len());
      let utxos_map = match build_utxos_for_era(&era, &utxos, &mut cbor_list) {
        Ok(u) => u,
        Err(e) => {
          return ValidationResponse {
            era: "babbage".to_string(),
            checks: vec![ValidationCheck {
              rule: "decode".to_string(),
              passed: false,
              error: Some(e),
            }],
            valid: false,
          }
        }
      };

      let pparams: NapiBabbageProtParams = match serde_json::from_str(&pparams_json) {
        Ok(p) => p,
        Err(e) => {
          return ValidationResponse {
            era: "babbage".to_string(),
            checks: vec![ValidationCheck {
              rule: "params".to_string(),
              passed: false,
              error: Some(format!("Failed to parse Babbage params: {}", e)),
            }],
            valid: false,
          }
        }
      };
      let babbage_pps = pparams.into_pallas();

      match validate_babbage_tx(
        &***x,
        &utxos_map,
        &babbage_pps,
        &slot_u64,
        &network_magic,
        &network_id,
      ) {
        Ok(()) => ValidationResponse {
          era: "babbage".to_string(),
          checks: build_all_passed(BABBAGE_CHECKS),
          valid: true,
        },
        Err(e) => ValidationResponse {
          era: "babbage".to_string(),
          checks: build_checks_from_error(BABBAGE_CHECKS, &e),
          valid: false,
        },
      }
    }
    MultiEraTx::AlonzoCompatible(x, era) => {
      if !matches!(era, Era::Alonzo) {
        let era_name = match era {
          Era::Shelley => "shelley",
          Era::Allegra => "allegra",
          Era::Mary => "mary",
          _ => "unknown",
        };
        return unsupported_era_response(era_name);
      }

      let alonzo_era = Era::Alonzo;
      let mut cbor_list = Vec::with_capacity(utxos.len());
      let utxos_map = match build_utxos_for_era(&alonzo_era, &utxos, &mut cbor_list) {
        Ok(u) => u,
        Err(e) => {
          return ValidationResponse {
            era: "alonzo".to_string(),
            checks: vec![ValidationCheck {
              rule: "decode".to_string(),
              passed: false,
              error: Some(e),
            }],
            valid: false,
          }
        }
      };

      let pparams: NapiAlonzoProtParams = match serde_json::from_str(&pparams_json) {
        Ok(p) => p,
        Err(e) => {
          return ValidationResponse {
            era: "alonzo".to_string(),
            checks: vec![ValidationCheck {
              rule: "params".to_string(),
              passed: false,
              error: Some(format!("Failed to parse Alonzo params: {}", e)),
            }],
            valid: false,
          }
        }
      };
      let alonzo_pps = pparams.into_pallas();

      match validate_alonzo_tx(&***x, &utxos_map, &alonzo_pps, &slot_u64, &network_id) {
        Ok(()) => ValidationResponse {
          era: "alonzo".to_string(),
          checks: build_all_passed(ALONZO_CHECKS),
          valid: true,
        },
        Err(e) => ValidationResponse {
          era: "alonzo".to_string(),
          checks: build_checks_from_error(ALONZO_CHECKS, &e),
          valid: false,
        },
      }
    }
    MultiEraTx::Byron(_) => unsupported_era_response("byron"),
    _ => unsupported_era_response("unknown"),
  }
}
