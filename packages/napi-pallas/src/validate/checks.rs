use pallas::ledger::validate::utils::{AlonzoError, PostAlonzoError, ValidationError};

use super::{ValidationCheck, ValidationResponse};

pub type ErrorMatcher = fn(&ValidationError) -> bool;

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
  matches!(
    e,
    ValidationError::PostAlonzo(PostAlonzoError::MintingLacksPolicy(_))
  )
}

static POST_ALONZO_CHECKS: &[(&str, ErrorMatcher)] = &[
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
  ("check_tx_size", post_alonzo_matcher!(MaxTxSizeExceeded)),
  ("check_tx_ex_units", post_alonzo_matcher!(TxExUnitsExceeded)),
  ("check_minting", check_minting_policy_error),
  (
    "check_well_formedness",
    post_alonzo_matcher!(
      RedeemerMissing,
      UnneededRedeemer,
      DatumMissing,
      UnneededDatum
    ),
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
  ("check_auxiliary_data", post_alonzo_matcher!(MetadataHash)),
  (
    "check_script_data_hash",
    post_alonzo_matcher!(ScriptIntegrityHash),
  ),
];

pub static CONWAY_CHECKS: &[(&str, ErrorMatcher)] = POST_ALONZO_CHECKS;
pub static BABBAGE_CHECKS: &[(&str, ErrorMatcher)] = POST_ALONZO_CHECKS;

pub static ALONZO_CHECKS: &[(&str, ErrorMatcher)] = &[
  ("check_ins_not_empty", alonzo_matcher!(TxInsEmpty)),
  (
    "check_ins_and_collateral_in_utxos",
    alonzo_matcher!(InputNotInUTxO, CollateralNotInUTxO),
  ),
  (
    "check_tx_validity_interval",
    alonzo_matcher!(
      BlockPrecedesValInt,
      BlockExceedsValInt,
      ValIntUpperBoundMissing
    ),
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
  ("check_min_lovelace", alonzo_matcher!(MinLovelaceUnreached)),
  ("check_output_val_size", alonzo_matcher!(MaxValSizeExceeded)),
  (
    "check_network_id",
    alonzo_matcher!(OutputWrongNetworkID, TxWrongNetworkID),
  ),
  ("check_tx_size", alonzo_matcher!(MaxTxSizeExceeded)),
  ("check_tx_ex_units", alonzo_matcher!(TxExUnitsExceeded)),
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
  ("check_auxiliary_data", alonzo_matcher!(MetadataHash)),
  (
    "check_script_data_hash",
    alonzo_matcher!(ScriptIntegrityHash),
  ),
  ("check_minting", alonzo_matcher!(MintingLacksPolicy)),
];

pub fn build_checks_from_error(
  checks: &[(&str, ErrorMatcher)],
  error: &ValidationError,
) -> Vec<ValidationCheck> {
  let failed_at = checks.iter().position(|&(_, matcher)| matcher(error));

  match failed_at {
    None => build_all_passed(checks),
    Some(failed_at) => {
      let message = error.to_string();

      checks
        .iter()
        .enumerate()
        .map(|(index, &(name, _))| ValidationCheck {
          rule: name.to_string(),
          passed: index < failed_at,
          error: if index == failed_at {
            Some(message.clone())
          } else if index > failed_at {
            Some("skipped".to_string())
          } else {
            None
          },
        })
        .collect()
    }
  }
}

pub fn build_all_passed(checks: &[(&str, ErrorMatcher)]) -> Vec<ValidationCheck> {
  checks
    .iter()
    .map(|&(name, _)| ValidationCheck {
      rule: name.to_string(),
      passed: true,
      error: None,
    })
    .collect()
}

pub fn unsupported_era_response(era: &str) -> ValidationResponse {
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
