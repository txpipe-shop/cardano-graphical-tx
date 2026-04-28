# Issue 01: Research test vector criteria for DolosProvider tests

> **good first issue** — This issue is beginner-friendly and a great way to understand what makes a Cardano transaction, block, or address "interesting" for testing.

## Goal
Define the criteria for selecting hardcoded test vectors (transactions, blocks, addresses) that will be used to validate `DolosProvider` against Blockfrost across mainnet, preprod, and preview.

## Why this matters
Hardcoded vectors make tests deterministic and prevent regressions. If we only test against "latest" data, tests break whenever the chain advances. We need vectors that are:
- **Stable:** Very unlikely to roll back or change
- **Comprehensive:** Exercise many code paths in the provider
- **Available on all networks:** Or at least documented per-network

## Deliverable
A markdown file at `packages/cardano-provider-dolos/test/CRITERIA.md` documenting the criteria below.

## Transaction Criteria
A "good" test transaction should ideally tick as many boxes as possible:

| Feature | Why it matters |
|---------|---------------|
| Old block height (e.g., epoch 100+) | Stability — unlikely to rollback |
| Multiple inputs (>1) | Tests input resolution logic |
| Multiple outputs (>2) | Tests output mapping |
| Native assets (minted or transferred) | Tests `Value` mapping, `Unit` parsing |
| Inline datum | Tests `DatumType.INLINE` path |
| Datum hash | Tests `DatumType.HASH` path |
| Redeemers | Tests `witnesses.redeemers` mapping |
| Reference inputs | Tests `referenceInputs` field |
| Metadata | Tests `metadata` parsing |
| Validity interval (`invalidBefore` / `invalidHereafter`) | Tests `validityInterval` mapping |
| Treasury donation | Tests `treasuryDonation` field (Conway) |
| Script involvement | Tests `witnesses.scripts` mapping |

## Block Criteria

| Feature | Why it matters |
|---------|---------------|
| Contains diverse txs (simple + complex) | Exercises multiple tx mapping paths in one batch |
| Known hash, height, and slot | Tests all three `BlockReq` variants |
| Not the genesis block | Avoids edge cases with empty bodies |

## Address Criteria

| Feature | Why it matters |
|---------|---------------|
| Has active UTxOs with lovelace | Tests basic `getAddressFunds` |
| Has native assets in UTxOs | Tests asset value mapping |
| Has been used in many txs | Tests pagination in `getAddressUTxOs` |
| Empty address (never used) | Tests empty-state handling |
| Stake/delegation address | Tests address parsing variants |

## Network Coverage

Criteria should be evaluated per network:
- **Mainnet:** Highest stability requirement; prefer very old epochs
- **Preprod:** Used for integration testing; prefer well-known test vectors
- **Preview:** Used for early feature testing; prefer recent but stable blocks

## Notes
- It is okay if a single transaction does not satisfy all criteria. The test suite uses multiple vectors.
- Document any trade-offs (e.g., "this tx has inline datum but no native assets").
- Include explorer links (cexplorer.io, preprod.cexplorer.io, etc.) for verification.

## Acceptance Criteria
- [ ] `CRITERIA.md` created with all sections above
- [ ] At least one example transaction per network is annotated against the criteria checklist
- [ ] File is reviewed and approved by a maintainer

## Related
- Next: [02-lookup-test-vectors.md](02-lookup-test-vectors.md)
