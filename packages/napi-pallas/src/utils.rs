use pallas::ledger::primitives::conway::PlutusData;
use pallas_crypto::hash::Hasher;
use pallas_primitives::{Fragment, ToCanonicalJson};

use crate::Datum;

pub fn parse_datum_info(raw: String) -> Option<Datum> {
  let cbor = hex::decode(raw.clone()).ok()?;
  let data = PlutusData::decode_fragment(&cbor).ok()?;

  Some(Datum {
    hash: Hasher::<256>::hash(&cbor).to_string(),
    json: data.to_json().to_string(),
    bytes: raw.clone(),
  })
}
