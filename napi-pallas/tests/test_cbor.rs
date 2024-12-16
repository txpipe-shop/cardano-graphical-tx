mod common;

use crate::common::all_params::{ALL_PARAMS_JSON, ALL_PARAMS_RES_DIAG, ALL_PARAMS_RES_HEX};
use crate::common::empty_params::{EMPTY_PARAMS_JSON, EMPTY_PARAMS_RES_DIAG, EMPTY_PARAMS_RES_HEX};
use crate::common::input_output::{INPUT_OUTPUT_JSON, INPUT_OUTPUT_RES_DIAG, INPUT_OUTPUT_RES_HEX};
use napi_pallas::cbor;

#[test]
fn test_empty_params() {
  println!("Running test_empty_params");
  let empty_params_json = EMPTY_PARAMS_JSON.to_owned();

  let result = cbor::parse_dsl(empty_params_json);

  let parsed_result: serde_json::Value = serde_json::from_str(&result).unwrap();

  assert!(
    !parsed_result.get("error").is_some(),
    "parse_dsl returned an error: {}",
    parsed_result.get("error").unwrap()
  );

  let cbor_hex = parsed_result.get("cbor_hex").unwrap().as_str().unwrap();

  assert_eq!(
    cbor_hex, EMPTY_PARAMS_RES_HEX,
    "CBOR hex does not match the expected result"
  );

  let cbor_diag = parsed_result
    .get("cbor_diagnostic")
    .unwrap()
    .as_str()
    .unwrap();

  assert_eq!(
    cbor_diag, EMPTY_PARAMS_RES_DIAG,
    "CBOR diagnostic does not match the expected result"
  );
}

#[test]
fn test_all_params() {
  println!("Running test_all_params");
  let all_params_json = ALL_PARAMS_JSON.to_owned();

  let result = cbor::parse_dsl(all_params_json);

  let parsed_result: serde_json::Value = serde_json::from_str(&result).unwrap();

  assert!(
    !parsed_result.get("error").is_some(),
    "parse_dsl returned an error: {}",
    parsed_result.get("error").unwrap()
  );

  let cbor_hex = parsed_result.get("cbor_hex").unwrap().as_str().unwrap();

  assert_eq!(
    cbor_hex, ALL_PARAMS_RES_HEX,
    "CBOR hex does not match the expected result"
  );

  let cbor_diag = parsed_result
    .get("cbor_diagnostic")
    .unwrap()
    .as_str()
    .unwrap();

  assert_eq!(
    cbor_diag, ALL_PARAMS_RES_DIAG,
    "CBOR diagnostic does not match the expected result"
  );
}
#[test]
fn test_100_inputs_outputs() {
  println!("Running test_100_inputs_outputs");
  let input_output_json = INPUT_OUTPUT_JSON.to_owned();

  let result = cbor::parse_dsl(input_output_json);

  let parsed_result: serde_json::Value = serde_json::from_str(&result).unwrap();

  assert!(
    !parsed_result.get("error").is_some(),
    "parse_dsl returned an error: {}",
    parsed_result.get("error").unwrap()
  );

  let cbor_hex = parsed_result.get("cbor_hex").unwrap().as_str().unwrap();

  assert_eq!(
    cbor_hex, INPUT_OUTPUT_RES_HEX,
    "CBOR hex does not match the expected result"
  );

  let cbor_diag = parsed_result
    .get("cbor_diagnostic")
    .unwrap()
    .as_str()
    .unwrap();

  assert_eq!(
    cbor_diag, INPUT_OUTPUT_RES_DIAG,
    "CBOR diagnostic does not match the expected result"
  );
}
