use pallas_crypto::hash::Hash;
use serde_json::{json, Value};
use std::collections::HashSet;

// REVIEW: Should we use a differents values?
pub const FIXED_POLICY: Option<Hash<28>> = Some(Hash::<28>::new([0; 28]));
pub const FIXED_HASH: Hash<32> = Hash::<32>::new([0; 32]);

pub fn preprocess_json(raw: &str) -> Result<Value, serde_json::Error> {
  let mut res: Value = serde_json::from_str(raw)?;

  if let Some(inputs) = res["transaction"]["inputs"].as_array_mut() {
    let mut used_indices: HashSet<u64> = inputs
      .iter()
      .filter_map(|input| input["index"].as_u64())
      .collect();

    let mut next_index = *used_indices.iter().max().unwrap_or(&0) + 1;

    for input in inputs.iter_mut() {
      if input["txHash"].is_null() {
        input["txHash"] = json!(FIXED_HASH);
      }

      if input["index"].is_null() {
        while used_indices.contains(&next_index) {
          next_index += 1;
        }
        input["index"] = json!(next_index);
        used_indices.insert(next_index);
      }
    }

    inputs.sort_by(|a, b| {
      let tx_hash_a = a["txHash"].as_str().unwrap_or_default();
      let tx_hash_b = b["txHash"].as_str().unwrap_or_default();

      let index_a = a["index"].as_u64().unwrap_or_default();
      let index_b = b["index"].as_u64().unwrap_or_default();

      tx_hash_a.cmp(tx_hash_b).then(index_a.cmp(&index_b))
    });
  }

  Ok(res)
}
