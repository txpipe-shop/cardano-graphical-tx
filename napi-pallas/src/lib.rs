#![deny(clippy::all)]

use std::collections::HashMap;

use pallas::ledger::traverse::MultiEraTx;

#[macro_use]
extern crate napi_derive;

mod address;
mod cbor;
mod tx;
mod utils;

#[derive(Clone)]
#[napi(object)]
pub struct Datum {
  pub hash: String,
  pub bytes: String,
  pub json: String,
}

#[derive(Default)]
#[napi(object)]
pub struct Asset {
  pub asset_name: String,
  pub asset_name_ascii: Option<String>,
  pub amount: Option<i64>,
}

#[derive(Default)]
#[napi(object)]
pub struct Assets {
  pub policy_id: String,
  pub assets_policy: Vec<Asset>,
}

#[derive(Default)]
#[napi(object)]
pub struct Utxo {
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
pub struct Input {
  pub tx_hash: String,
  pub index: i64,
}

#[derive(Default)]
#[napi(object)]
pub struct Metadata {
  pub label: String,
  pub json_metadata: HashMap<String, String>,
}

#[derive(Default)]
#[napi(object)]
pub struct Withdrawal {
  pub raw_address: String,
  pub amount: i64,
}

#[derive(Default)]
#[napi(object)]
pub struct Certificates {
  pub json: String,
}

#[derive(Default)]
#[napi(object)]
pub struct Collateral {
  pub total: Option<i64>,
  pub collateral_return: Vec<Input>,
}

#[derive(Default)]
#[napi(object)]
pub struct Witness {
  pub key: String,
  pub hash: String,
  pub signature: String,
}

#[derive(Default)]
#[napi(object)]
pub struct ExUnits {
  pub mem: i64,
  pub steps: i64,
}

#[derive(Default)]
#[napi(object)]
pub struct Redeemer {
  pub tag: String,
  pub index: u32,
  pub data_json: String,
  pub ex_units: ExUnits,
}

#[derive(Default)]
#[napi(object)]
pub struct Witnesses {
  pub vkey_witnesses: Vec<Witness>,
  pub redeemers: Vec<Redeemer>,
  pub plutus_data: Vec<Datum>,
  pub plutus_v1_scripts: Vec<String>,
  pub plutus_v2_scripts: Vec<String>,
  pub plutus_v3_scripts: Vec<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct CborResponse {
  pub era: String,
  pub tx_hash: String,
  pub scripts_successful: bool,
  pub fee: Option<i64>,
  pub inputs: Vec<Input>,
  pub reference_inputs: Vec<Input>,
  pub outputs: Vec<Utxo>,
  pub mints: Vec<Assets>,
  pub validity_start: Option<i64>,
  pub ttl: Option<i64>,
  pub metadata: Vec<Metadata>,
  pub withdrawals: Vec<Withdrawal>,
  pub certificates: Vec<Certificates>,
  pub collateral: Collateral,
  pub witnesses: Witnesses,
  pub size: i64,
  pub error: String,
}

impl CborResponse {
  fn new() -> Self {
    Default::default()
  }

  fn with_cbor_attr(
    self,
    tx: MultiEraTx<'_>,
    inputs: Vec<Input>,
    reference_inputs: Vec<Input>,
    outputs: Vec<Utxo>,
    mints: Vec<Assets>,
    metadata: Vec<Metadata>,
    withdrawals: Vec<Withdrawal>,
    certificates: Vec<Certificates>,
    collateral: Collateral,
    witnesses: Witnesses,
  ) -> Self {
    Self {
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
  match tx::cbor_to_tx(raw) {
    Ok(x) => x,
    Err(x) => x,
  }
}

#[napi]
pub fn parse_datum_info(raw: String) -> Option<Datum> {
  tx::parse_datum_info(raw)
}

#[napi]
pub fn parse_dsl(raw: String) -> String {
  cbor::parse_dsl(raw)
}
