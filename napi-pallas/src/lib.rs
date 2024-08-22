#![deny(clippy::all)]

use std::collections::HashMap;

use pallas::ledger::{primitives::conway::DatumHash, traverse::MultiEraTx};

#[macro_use]
extern crate napi_derive;

mod address;
mod tx;

#[derive(Debug, Clone)]
#[napi(object)]
pub struct Datum {
  pub hash: String,
  pub bytes: String,
  pub json: String,
}

#[derive(Default, Debug)]
#[napi(object)]
pub struct OutputUtxo {
  pub tx_hash: String,
  pub index: String,
  pub datum: Option<Datum>,
  pub address: String,
  pub assets: Vec<Assets>,
}

#[derive(Default, Debug)]
#[napi(object)]
pub struct InputUtxo {
  pub tx_hash: String,
  pub index: String,
}

#[derive(Default, Debug)]
#[napi(object)]
pub struct Assets {
  pub policy_id: String,
  pub asset_name: String,
  pub quantity: String,
}

#[derive(Debug, Default)]
#[napi(object)]
pub struct CborResponse {
  pub tx_hash: String,
  pub fee: Option<String>,
  pub inputs: Vec<InputUtxo>,
  pub reference_inputs: Vec<InputUtxo>,
  pub outputs: Vec<OutputUtxo>,
  pub mints: Vec<Assets>,
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
  ) -> Self {
    Self {
      tx_hash: tx.hash().to_string(),
      fee: tx.fee().map(|x| x.to_string()),
      inputs: inputs,
      reference_inputs: reference_inputs,
      outputs: outputs,
      mints,
      ..self
    }
  }

  fn try_build<F>(mut self, func: F) -> Self
  where
    F: FnOnce() -> anyhow::Result<CborResponse>,
  {
    match func() {
      Ok(x) => {
        self.tx_hash = x.tx_hash;
        self.fee = x.fee;
        self.inputs = x.inputs;
        self.reference_inputs = x.reference_inputs;
        self.outputs = x.outputs;
        self.mints = x.mints;
      }
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

fn compute_datum_hashmap<'b>(mtx: MultiEraTx<'b>) -> HashMap<DatumHash, Datum> {
  let mut m = HashMap::new();
  let plutus_data = mtx.plutus_data();
  plutus_data.iter().for_each(|datum| {
    let hash = pallas_crypto::hash::Hasher::<256>::hash(datum.raw_cbor());
    m.insert(
      hash,
      Datum {
        hash: hash.to_string(),
        bytes: hex::encode(datum.raw_cbor()),
        json: serde_json::to_string(&datum.clone().unwrap()).unwrap(),
      },
    );
  });

  return m;
}
