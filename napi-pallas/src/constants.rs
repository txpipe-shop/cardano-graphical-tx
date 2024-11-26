use pallas_crypto::hash::Hash;

// REVIEW: Should we use a differents values?
pub const FIXED_POLICY: Option<Hash<28>> = Some(Hash::<28>::new([0; 28]));
pub const FIXED_HASH: Hash<32> = Hash::<32>::new([0; 32]);
pub const FIXED_INDEX: u64 = u64::MAX;
