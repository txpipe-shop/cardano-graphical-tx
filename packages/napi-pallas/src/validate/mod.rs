mod checks;
mod params;
mod types;
mod utxos;

use pallas::ledger::traverse::{Era, MultiEraTx};
use pallas::ledger::validate::phase1::alonzo::validate_alonzo_tx;
use pallas::ledger::validate::phase1::babbage::validate_babbage_tx;
use pallas::ledger::validate::phase1::conway::validate_conway_tx;
use pallas::ledger::validate::utils::ValidationError;

use crate::Utxo;
use self::checks::{
  build_all_passed, build_checks_from_error, unsupported_era_response, ALONZO_CHECKS,
  BABBAGE_CHECKS, CONWAY_CHECKS, ErrorMatcher,
};
use self::params::{NapiAlonzoProtParams, NapiBabbageProtParams, NapiConwayProtParams};
pub use self::types::{ValidationCheck, ValidationResponse};
use self::utxos::build_utxos_for_era;

fn err(era: &str, rule: &str, msg: String) -> ValidationResponse {
  ValidationResponse {
    era: era.to_string(),
    checks: vec![ValidationCheck {
      rule: rule.to_string(),
      passed: false,
      error: Some(msg),
    }],
    valid: false,
  }
}

fn validate_result(
  era: &str,
  checks: &[(&str, ErrorMatcher)],
  result: Result<(), ValidationError>,
) -> ValidationResponse {
  match result {
    Ok(()) => ValidationResponse {
      era: era.to_string(),
      checks: build_all_passed(checks),
      valid: true,
    },
    Err(e) => ValidationResponse {
      era: era.to_string(),
      checks: build_checks_from_error(checks, &e),
      valid: false,
    },
  }
}

// &***x below: deref through napi-rs Box wrapper → &ConwayTx etc.
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
    Err(e) => return err("unknown", "decode", format!("Failed to decode CBOR: {}", e)),
  };

  let metx = match MultiEraTx::decode(&cbor_bytes) {
    Ok(tx) => tx,
    Err(e) => return err("unknown", "decode", format!("Failed to decode transaction: {}", e)),
  };

  match &metx {
    MultiEraTx::Conway(x) => {
      let era = Era::Conway;
      let mut cbor_list = Vec::with_capacity(utxos.len());
      let utxos_map = match build_utxos_for_era(&era, &utxos, &mut cbor_list) {
        Ok(u) => u,
        Err(e) => return err("conway", "decode", e.to_string()),
      };

      let pparams: NapiConwayProtParams = match serde_json::from_str(&pparams_json) {
        Ok(p) => p,
        Err(e) => return err("conway", "params", format!("Failed to parse Conway params: {}", e)),
      };
      let conway_pps = pparams.into();

      validate_result("conway", CONWAY_CHECKS, validate_conway_tx(&***x, &utxos_map, &conway_pps, &slot_u64, &network_id))
    }
    MultiEraTx::Babbage(x) => {
      let era = Era::Babbage;
      let mut cbor_list = Vec::with_capacity(utxos.len());
      let utxos_map = match build_utxos_for_era(&era, &utxos, &mut cbor_list) {
        Ok(u) => u,
        Err(e) => return err("babbage", "decode", e.to_string()),
      };

      let pparams: NapiBabbageProtParams = match serde_json::from_str(&pparams_json) {
        Ok(p) => p,
        Err(e) => return err("babbage", "params", format!("Failed to parse Babbage params: {}", e)),
      };
      let babbage_pps = pparams.into();

      validate_result("babbage", BABBAGE_CHECKS, validate_babbage_tx(&***x, &utxos_map, &babbage_pps, &slot_u64, &network_magic, &network_id))
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
        Err(e) => return err("alonzo", "decode", e.to_string()),
      };

      let pparams: NapiAlonzoProtParams = match serde_json::from_str(&pparams_json) {
        Ok(p) => p,
        Err(e) => return err("alonzo", "params", format!("Failed to parse Alonzo params: {}", e)),
      };
      let alonzo_pps = pparams.into();

      validate_result("alonzo", ALONZO_CHECKS, validate_alonzo_tx(&***x, &utxos_map, &alonzo_pps, &slot_u64, &network_id))
    }
    MultiEraTx::Byron(_) => unsupported_era_response("byron"),
    _ => unsupported_era_response("unknown"),
  }
}
