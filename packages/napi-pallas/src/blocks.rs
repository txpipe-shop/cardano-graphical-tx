use pallas::ledger::traverse::MultiEraBlock;

use crate::{CborResponse, SafeBlockCborResponse};

#[derive(Default)]
#[napi(object)]
pub struct BlockHeader {
  pub era: String,
  pub block_number: Option<i64>,
  pub slot: Option<i64>,
  pub hash: String,
  pub previous_hash: Option<String>,
  pub issuer_vkey: Option<String>,
  pub vrf_vkey: Option<String>,
  pub block_body_size: Option<i64>,
  pub block_body_hash: Option<String>,
}

#[derive(Default)]
#[napi(object)]
pub struct BlockCborResponse {
  pub header: BlockHeader,
  pub transactions: Vec<CborResponse>,
  pub transactions_count: i64,
}

fn get_block_header(block: &MultiEraBlock<'_>) -> BlockHeader {
  BlockHeader {
    era: block.era().to_string(),
    block_number: Some(block.number() as i64),
    slot: Some(block.slot() as i64),
    hash: block.hash().to_string(),
    previous_hash: None,
    issuer_vkey: None,
    vrf_vkey: None,
    block_body_size: block.body_size().map(|s| s as i64),
    block_body_hash: None,
  }
}

fn get_block_transactions(block: &MultiEraBlock<'_>) -> Result<Vec<CborResponse>, String> {
  block
    .txs()
    .iter()
    .map(|tx| crate::tx::parse_tx_from_multiera(tx, true))
    .collect()
}

pub fn cbor_to_block(raw: String) -> SafeBlockCborResponse {
  SafeBlockCborResponse::new().try_build(|| {
    let cbor = hex::decode(raw).map_err(|e| format!("Failed to decode hex. {}", e))?;
    let block =
      MultiEraBlock::decode(&cbor).map_err(|e| format!("Failed to decode block. {}", e))?;

    let header = get_block_header(&block);
    let transactions = get_block_transactions(&block)?;
    let transactions_count = transactions.len() as i64;

    Ok(BlockCborResponse {
      header,
      transactions,
      transactions_count,
    })
  })
}
