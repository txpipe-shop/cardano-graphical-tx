use pallas_crypto::hash::Hash;

// REVIEW: Should we use a differents values?
pub const FIXED_POLICY: Option<Hash<28>> = Some(Hash::<28>::new([0; 28]));
pub const FIXED_HASH: Hash<32> = Hash::<32>::new([0; 32]);

pub fn parse_datum_info(raw: String) -> Option<Datum> {
  let cbor = hex::decode(raw.clone()).ok()?;
  let data = PlutusData::decode_fragment(&cbor).ok()?;

  Some(Datum {
    hash: Hasher::<256>::hash(&cbor).to_string(),
    json: data.to_json().to_string(),
    bytes: raw.clone(),
  })
}
