#![deny(clippy::all)]

use std::{collections::HashMap, str::FromStr};

use pallas::ledger::traverse::MultiEraTx;
use pallas_network::{facades::PeerClient, miniprotocols::Point};

#[macro_use]
extern crate napi_derive;

mod address;
mod blocks;
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

/// A native script from the transaction witness set (key 1).
/// Serialised as canonical JSON matching the pallas `NativeScript` serde output.
//#[derive(Default)]
//#[napi(object)]

#[napi]
pub enum NativeScript {
  ScriptPubkey(String),
  ScriptAll(Vec<NativeScript>),
  ScriptAny(Vec<NativeScript>),
  ScriptNOfK(u32, Vec<NativeScript>),
  InvalidBefore(u128),
  InvalidHereafter(u128),
}

/// One row from the `voting_procedures` map (tx_body key 19).
/// Complex sub-structures (voter type) are encoded in `voter_json`.
#[derive(Default)]
#[napi(object)]
pub struct VotingProcedure {
  /// Serde-JSON of the `Voter` enum (ConstitutionalCommitteeKey/Script, DRepKey/Script, StakePoolKey)
  pub voter_json: String,
  pub gov_action_tx_hash: String,
  pub gov_action_index: u32,
  /// "No" | "Yes" | "Abstain"
  pub vote: String,
  pub anchor_url: Option<String>,
  pub anchor_data_hash: Option<String>,
}

/// One entry from the `proposal_procedures` set (tx_body key 20).
/// The governance action is serialised as JSON because it is a complex enum.
#[derive(Default)]
#[napi(object)]
pub struct ProposalProcedure {
  pub deposit: i64,
  /// Hex-encoded reward account bytes
  pub reward_account: String,
  /// Serde-JSON of the `GovAction` enum
  pub gov_action_json: String,
  pub anchor_url: String,
  pub anchor_data_hash: String,
}

/// A Byron-era bootstrap (signature) witness (witness_set key 2).
/// All fields are hex-encoded bytes.
#[derive(Default)]
#[napi(object)]
pub struct BootstrapWitness {
  /// Hex-encoded Ed25519 extended public key (64 bytes)
  pub public_key: String,
  /// Hex-encoded signature
  pub signature: String,
  /// Hex-encoded chain code (32 bytes)
  pub chain_code: String,
  /// Hex-encoded address attributes (network magic / derivation path)
  pub attributes: String,
}

/// Scripts attached to `auxiliary_data` (distinct from witness-set scripts).
/// In the current pallas version (1.0.0-alpha.3) only native scripts and
/// Plutus V1 scripts are accessible via the unified `alonzo::AuxiliaryData`
/// type; V2/V3 aux-data scripts require a future pallas update.
#[derive(Default)]
#[napi(object)]
pub struct AuxiliaryDataScripts {
  pub native_scripts: Vec<NativeScript>,
  pub plutus_v1_scripts: Vec<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct Witnesses {
  pub vkey_witnesses: Vec<Witness>,
  pub bootstrap_witnesses: Vec<BootstrapWitness>,
  pub native_scripts: Vec<NativeScript>,
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
  /// Hex-encoded auxiliary data hash (tx_body key 7)
  pub auxiliary_data_hash: Option<String>,
  /// Hex-encoded script data hash (tx_body key 11)
  pub script_data_hash: Option<String>,
  /// Hex-encoded required signer keyhashes (tx_body key 14)
  pub required_signers: Vec<String>,
  /// Network id: 0 = testnet, 1 = mainnet (tx_body key 15)
  pub network_id: Option<u8>,
  pub metadata: Vec<Metadata>,
  pub withdrawals: Vec<Withdrawal>,
  pub certificates: Vec<Certificates>,
  pub collateral: Collateral,
  /// Conway governance voting procedures (tx_body key 19)
  pub voting_procedures: Vec<VotingProcedure>,
  /// Conway governance proposal procedures (tx_body key 20)
  pub proposal_procedures: Vec<ProposalProcedure>,
  /// Current treasury value in lovelace (tx_body key 21)
  pub current_treasury_value: Option<i64>,
  /// Donation to treasury in lovelace (tx_body key 22)
  pub donation: Option<i64>,
  pub witnesses: Witnesses,
  /// Scripts embedded in auxiliary_data (distinct from witness-set scripts)
  pub auxiliary_scripts: AuxiliaryDataScripts,
  pub size: i64,
  pub cbor: Option<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct SafeCborResponse {
  pub cbor_res: Option<CborResponse>,
  pub error: String,
}

#[derive(Default)]
#[napi(object)]
pub struct SafeBlockCborResponse {
  pub cbor_res: Option<blocks::BlockCborResponse>,
  pub error: String,
}

impl CborResponse {
  fn new() -> Self {
    Default::default()
  }

  #[allow(clippy::too_many_arguments)]
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
    auxiliary_data_hash: Option<String>,
    script_data_hash: Option<String>,
    required_signers: Vec<String>,
    network_id: Option<u8>,
    voting_procedures: Vec<VotingProcedure>,
    proposal_procedures: Vec<ProposalProcedure>,
    current_treasury_value: Option<i64>,
    donation: Option<i64>,
    auxiliary_scripts: AuxiliaryDataScripts,
    cbor: Option<String>,
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
      auxiliary_data_hash,
      script_data_hash,
      required_signers,
      network_id,
      voting_procedures,
      proposal_procedures,
      current_treasury_value,
      donation,
      auxiliary_scripts,
      size: tx.size() as i64,
      cbor,
    }
  }
}

impl SafeCborResponse {
  pub(crate) fn new() -> Self {
    Default::default()
  }

  pub(crate) fn try_build<F>(mut self, func: F) -> Self
  where
    F: FnOnce() -> Result<CborResponse, String>,
  {
    match func() {
      Ok(x) => self.cbor_res = Some(x),
      Err(x) => self.error = x,
    };

    self
  }
}

impl SafeBlockCborResponse {
  pub(crate) fn new() -> Self {
    Default::default()
  }

  pub(crate) fn try_build<F>(mut self, func: F) -> Self
  where
    F: FnOnce() -> Result<blocks::BlockCborResponse, String>,
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
pub fn cbor_parse_block(raw: String) -> SafeBlockCborResponse {
  blocks::cbor_to_block(raw)
}

#[napi]
pub fn parse_datum_info(raw: String) -> Option<Datum> {
  utils::parse_datum_info(raw)
}

#[napi]
pub fn parse_address(raw: String) -> address::SafeAddressResponse {
  match address::Address::from_str(&raw) {
    Ok(addr) => address::SafeAddressResponse {
      error: None,
      address: Some(addr.into()),
    },
    Err(err) => address::SafeAddressResponse {
      error: Some(err.to_string()),
      address: None,
    },
  }
}

#[napi]
pub async fn download_block(node_url: String, magic: u32, slot: u32, hash: String) -> Vec<u8> {
  let mut peer = PeerClient::connect(node_url, magic as u64).await.unwrap();

  let point = Point::Specific(slot as u64, hex::decode(hash).unwrap());

  peer.blockfetch().fetch_single(point).await.unwrap()
}
