#![deny(clippy::all)]

use std::{collections::HashMap, str::FromStr};

use pallas::ledger::traverse::MultiEraTx;

#[macro_use]
extern crate napi_derive;

mod address;
pub mod cbor;
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
}

#[derive(Default)]
#[napi(object)]
pub struct SafeCborResponse {
  pub cbor_res: Option<CborResponse>,
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
}

impl SafeCborResponse {
  fn new() -> Self {
    Default::default()
  }

  fn try_build<F>(mut self, func: F) -> Self
  where
    F: FnOnce() -> anyhow::Result<CborResponse, String>,
  {
    match func() {
      Ok(x) => self.cbor_res = Some(x),
      Err(x) => self.error = x,
    };

    self
  }
}

#[napi]
pub fn cbor_parse(raw: String) -> SafeCborResponse {
  tx::cbor_to_tx(raw)
}

#[napi]
pub fn parse_datum_info(raw: String) -> Option<Datum> {
  utils::parse_datum_info(raw)
}

#[derive(Default)]
#[napi(object)]
pub struct DslResponse {
  pub cbor_hex: String,
  pub cbor_diagnostic: String,
}

#[derive(Default)]
#[napi(object)]
pub struct SafeDslResponse {
  pub dsl_res: Option<DslResponse>,
  pub error: String,
  pub instance_path: String,
}

impl SafeDslResponse {
  fn new() -> Self {
    Default::default()
  }

  fn try_build<F>(mut self, func: F) -> Self
  where
    F: FnOnce() -> anyhow::Result<DslResponse, (String, String)>,
  {
    match func() {
      Ok(x) => self.dsl_res = Some(x),
      Err((err, instace)) => {
        self.error = err;
        self.instance_path = instace;
      }
    };

    self
  }
}

#[napi]
pub fn parse_dsl(raw: String) -> SafeDslResponse {
  cbor::parse_dsl(raw)
}

#[napi]
pub fn parse_address(raw: String) -> address::SafeAddressResponse {
  match address::Address::from_str(&raw) {
    Ok(addr) => address::SafeAddressResponse {
      error: None,
      bytes: Some(hex::encode(addr.to_vec())),
      address: Some(addr.into()),
    },
    Err(err) => address::SafeAddressResponse {
      error: Some(err.to_string()),
      bytes: None,
      address: None,
    },
  }
}
