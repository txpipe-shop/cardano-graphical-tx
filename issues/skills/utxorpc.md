# Create Skill: UTxORPC in cardano-graphical-tx

> **good first issue** — This issue is beginner-friendly and a great way to get familiar with the project's most critical external dependency.

## Goal
Create a repository skill (`.agents/skills/utxorpc/SKILL.md`) that documents how to use UTxORPC (u5c) gRPC calls in the `cardano-graphical-tx` monorepo.

## Scope

The skill should cover:

### 1. Architecture
- How `UtxoRpcClient` is structured (`sync`, `query`, `submit`, `watch`)
- How transport is created and injected
- Key protobuf types: `FetchBlockRequest/Response`, `DumpHistoryRequest/Response`, `BlockRef`, `AnyChainBlock`, `cardano.Block`

### 2. Block validation pattern
- Document the `validateBlock(resp)` helper used by both `DolosProvider` and `U5CProvider`
- Explain how to unwrap `AnyChainBlock` and assert Cardano variant

### 3. Mapping helpers
- `u5cToCardanoBlock(block, tipHeight)` → `BlockMetadata`
- `u5cToCardanoTx(tx, timestamp, blockHash, blockHeight, blockSlot, indexInBlock)` → `cardano.Tx`
- Emphasize: always use these instead of hand-rolling mappings

### 4. Sensitive data rules
- Never hardcode UTxORPC base URLs or API keys
- URLs come from `getNetworkConfigServer(chain)` or user config
- API keys are injected via transport interceptors

### 5. Common pitfalls
- `DumpHistory` returns blocks from tip toward genesis by default
- `BlockRef` fields are protobuf `uint64`; use `bigint`
- `fetchBlock` accepts arrays but providers usually call with one ref
- `body.tx` in fetched blocks contains fully resolved transactions (inputs have `asOutput`)

## Related files to reference
- `packages/utxorpc-sdk/src/index.ts`
- `packages/cardano-provider-dolos/src/index.ts`
- `packages/cardano-provider-u5c/src/index.ts`
- `packages/cardano-provider-u5c/src/mappers.ts`

## Acceptance Criteria
- [ ] Skill file created at `.agents/skills/utxorpc/SKILL.md`
- [ ] Follows the format of existing skills in `.agents/skills/`
- [ ] Covers all 5 sections listed above
- [ ] Includes concrete code examples (validateBlock, mapping helpers)
- [ ] Mentions sensitive data handling explicitly

## Related
- `issues/explorer-block-scroll/02-dolos-dumpHistory-implementation.md`
- `issues/explorer-block-scroll/03-u5c-dumpHistory-implementation.md`
