mod common;

use crate::common::all_params::{ALL_PARAMS_JSON, ALL_PARAMS_RES_DIAG, ALL_PARAMS_RES_HEX};
use crate::common::empty_params::{EMPTY_PARAMS_JSON, EMPTY_PARAMS_RES_DIAG, EMPTY_PARAMS_RES_HEX};
use crate::common::input_output::{INPUT_OUTPUT_JSON, INPUT_OUTPUT_RES_DIAG, INPUT_OUTPUT_RES_HEX};
use napi_pallas::cbor;

#[test]
fn test_empty_params() {
  let empty_params_json = EMPTY_PARAMS_JSON.to_owned();

  let result = cbor::parse_dsl(empty_params_json);

  assert!(
    result.error.is_empty(),
    "parse_dsl returned an error: {}",
    result.error
  );

  let dsl_res = result.dsl_res.unwrap();

  assert_eq!(
    dsl_res.cbor_hex, EMPTY_PARAMS_RES_HEX,
    "CBOR hex does not match the expected result"
  );

  assert_eq!(
    dsl_res.cbor_diagnostic, EMPTY_PARAMS_RES_DIAG,
    "CBOR diagnostic does not match the expected result"
  );
}

#[test]
fn test_all_params() {
  let all_params_json = ALL_PARAMS_JSON.to_owned();

  let result = cbor::parse_dsl(all_params_json);

  assert!(
    result.error.is_empty(),
    "parse_dsl returned an error: {}",
    result.error
  );

  let dsl_res = result.dsl_res.unwrap();

  assert_eq!(
    dsl_res.cbor_hex, ALL_PARAMS_RES_HEX,
    "CBOR hex does not match the expected result"
  );

  assert_eq!(
    dsl_res.cbor_diagnostic, ALL_PARAMS_RES_DIAG,
    "CBOR diagnostic does not match the expected result"
  );
}
#[test]
fn test_100_inputs_outputs() {
  let input_output_json = INPUT_OUTPUT_JSON.to_owned();

  let result = cbor::parse_dsl(input_output_json);

  assert!(
    result.error.is_empty(),
    "parse_dsl returned an error: {}",
    result.error
  );

  let dsl_res = result.dsl_res.unwrap();

  assert_eq!(
    dsl_res.cbor_hex, INPUT_OUTPUT_RES_HEX,
    "CBOR hex does not match the expected result"
  );

  assert_eq!(
    dsl_res.cbor_diagnostic, INPUT_OUTPUT_RES_DIAG,
    "CBOR diagnostic does not match the expected result"
  );
}
