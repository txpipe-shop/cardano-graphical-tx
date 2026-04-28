# Issue 02: Lookup and record hardcoded test vectors for DolosProvider

> **good first issue** — This issue is beginner-friendly and requires using a Cardano explorer to find stable, interesting transactions.

## Goal
Find and record hardcoded test vectors (transactions, blocks, addresses) for mainnet, preprod, and preview that satisfy the criteria defined in Issue 01.

## Background
The `DolosProvider` test suite uses `defineProviderSuite` from `@laceanatomy/provider-tests`, which accepts `testVectors` containing:
- `txHash` — a stable transaction hash
- `block` — `{ hash, height, slot }` of a stable block
- `address` — `{ withUtxos, withNativeAssets, empty }`

If vectors are omitted, the suite falls back to `getLatestTx()`, which makes tests non-deterministic.

## Deliverables
Three TypeScript files:
- `packages/cardano-provider-dolos/test/vectors/mainnet.ts`
- `packages/cardano-provider-dolos/test/vectors/preprod.ts`
- `packages/cardano-provider-dolos/test/vectors/preview.ts`

## Vector Structure

```ts
export const mainnetVectors = {
  txHash: '64403900eb882a71f9aae0569b422c0c31a1787092a877ead54afd1b1f713b13',
  block: {
    hash: '...',
    height: 12345n,
    slot: 12345678n,
  },
  address: {
    withUtxos: 'addr1q8z6ty5v2yk5crjpdx7rswru92lhlryxh7xwc9mfzdmg855kn8exqdeytyq2uvd88av4l05qrpnh4aynhj6mtpetczys0jr0a0',
    withNativeAssets: 'addr1...',
    empty: 'addr1...',
  },
};
```

## Selection Guidelines

### Mainnet
- Prefer transactions from **epoch 300+** (very stable)
- Look for well-known transactions on cexplorer.io or cardanoscan.io
- Consider "famous" transactions like the first NFT mints, large DeFi interactions, or governance actions

### Preprod
- Use the preprod explorer (preprod.cexplorer.io)
- Prefer transactions from **epoch 50+**
- Many test transactions exist here; pick ones with diverse features

### Preview
- Use the preview explorer (preview.cexplorer.io)
- Prefer transactions from **epoch 20+**
- Preview has newer features (Conway era); good for testing treasury donations, etc.

## Validation Steps
For each vector, verify:
1. Transaction exists on the target network's explorer
2. Block hash/height/slot are consistent (hash at height matches slot)
3. Address has the expected UTxO state (not spent, assets present)
4. Include a comment with the explorer URL for each vector

## Acceptance Criteria
- [ ] `vectors/mainnet.ts` created with validated vectors
- [ ] `vectors/preprod.ts` created with validated vectors
- [ ] `vectors/preview.ts` created with validated vectors
- [ ] Each vector includes explorer URL comments
- [ ] Each vector is annotated with which criteria it satisfies (inline comments)
- [ ] A maintainer has verified at least one vector per network

## Related
- Previous: [01-research-test-criteria.md](01-research-test-criteria.md)
- Next: [03-implement-test-suite.md](03-implement-test-suite.md)
