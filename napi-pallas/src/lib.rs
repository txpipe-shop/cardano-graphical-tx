#![deny(clippy::all)]

use std::collections::HashMap;

use pallas::ledger::traverse::MultiEraTx;

#[macro_use]
extern crate napi_derive;

mod address;
mod tx;

#[derive(Clone)]
#[napi(object)]
pub struct Datum {
  pub hash: String,
  pub bytes: String,
  pub json: String,
}

#[derive(Default)]
#[napi(object)]
pub struct OutputUtxo {
  pub tx_hash: String,
  pub index: i64,
  pub bytes: String,
  pub address: String,
  pub lovelace: i64,
  pub datum: Option<Datum>,
  pub assets: Vec<Assets>,
  pub script_ref: Option<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct InputUtxo {
  pub tx_hash: String,
  pub index: String,
}

#[derive(Default)]
#[napi(object)]
pub struct Asset {
  pub asset_name: String,
  pub asset_name_ascii: Option<String>,
  pub coint: Option<i64>,
}

#[derive(Default)]
#[napi(object)]
pub struct Assets {
  pub policy_id: String,
  pub assets_policy: Vec<Asset>,
}

#[derive(Default)]
#[napi(object)]
pub struct MetadataItem {
  pub label: String,
  pub json_metadata: HashMap<String, String>,
}

#[derive(Default)]
#[napi(object)]
pub struct WithdrawalItem {
  pub raw_address: String,
  pub amount: String,
}

#[derive(Default)]
#[napi(object)]
pub struct Certificates {
  pub json: String,
}

#[derive(Default)]
#[napi(object)]
pub struct CborResponse {
  pub tx_hash: String,
  pub fee: Option<String>,
  pub era: String,
  pub validity_start: Option<String>,
  pub ttl: Option<String>,
  pub inputs: Vec<InputUtxo>,
  pub reference_inputs: Vec<InputUtxo>,
  pub outputs: Vec<OutputUtxo>,
  pub mints: Vec<Assets>,
  pub metadata: Vec<MetadataItem>,
  pub withdrawals: Vec<WithdrawalItem>,
  pub certificates: Vec<Certificates>,
  pub size: String,
  pub scripts_successful: bool,
  pub error: String,
}

impl CborResponse {
  fn new() -> Self {
    Default::default()
  }

  fn with_cbor_attr(
    self,
    tx: MultiEraTx<'_>,
    inputs: Vec<InputUtxo>,
    reference_inputs: Vec<InputUtxo>,
    outputs: Vec<OutputUtxo>,
    mints: Vec<Assets>,
    metadata: Vec<MetadataItem>,
    withdrawals: Vec<WithdrawalItem>,
    certificates: Vec<Certificates>,
  ) -> Self {
    Self {
      tx_hash: tx.hash().to_string(),
      fee: tx.fee().map(|x| x.to_string()),
      era: tx.era().to_string(),
      validity_start: tx.validity_start().map(|v| v.to_string()),
      ttl: tx.ttl().map(|v| v.to_string()),
      inputs,
      reference_inputs,
      outputs,
      mints,
      scripts_successful: tx.is_valid(),
      metadata,
      withdrawals,
      certificates,
      size: tx.size().to_string(),
      ..self
    }
  }

  fn try_build<F>(mut self, func: F) -> Self
  where
    F: FnOnce() -> anyhow::Result<CborResponse>,
  {
    match func() {
      Ok(x) => self = x,
      Err(_x) => self.error = "Invalid Cbor".to_string(),
    };

    self
  }
}

#[napi]
pub fn cbor_parse(raw: String) -> CborResponse {
  match tx::new_parse(raw) {
    Ok(x) => x,
    Err(x) => x,
  }
}

#[napi]
pub fn napi_parse_datum_info(raw: String) -> Option<Datum> {
  tx::parse_datum_info(raw)
}
