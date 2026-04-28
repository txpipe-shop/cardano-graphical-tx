# Issue 03: Implement `getBlocksWithTxs` in `U5CProvider`

> **good first issue** — This issue is beginner-friendly and a great way to get familiar with the U5CProvider and UTxORPC sync primitives.

## Goal
Mirror the `DolosProvider` implementation in `U5CProvider` so the devnet explorer path can also fetch blocks with nested transactions via `DumpHistory`.

## Background
`U5CProvider` uses the same `UtxoRpcClient` and has access to `sync.dumpHistory`. The implementation is nearly identical to `DolosProvider`, with two differences:
1. `U5CProvider` does not use Blockfrost at all — it is already pure UTxORPC.
2. `U5CProvider` already has `fetchBlockByQuery` helpers that can be reused for tip-height resolution.

## Changes

### File: `packages/cardano-provider-u5c/src/index.ts`

#### 1. Import new types from `provider-core`

```ts
import type {
  BlocksQuery,
  BlocksWithTxsRes,
  BlockWithTxs,
  CursorPaginatedRequest,
} from '@laceanatomy/provider-core';
```


#### 2. `getBlocksWithTxs` implementation

```ts
async getBlocksWithTxs(
  params: CursorPaginatedRequest<BlocksQuery | undefined>
): Promise<BlocksWithTxsRes<cardano.UTxO, cardano.Tx, Cardano>> { }
```

## Acceptance Criteria
- [ ] `U5CProvider` implements `getBlocksWithTxs`.
- [ ] Behavior matches `DolosProvider`: cursor round-trip, tip-relative ordering, nested txs.
- [ ] Devnet explorer can consume `getBlocksWithTxs` without falling back to flat `getTxs`.
- [ ] `pnpm check` passes.

## Related
- Previous: [02-dolos-dumpHistory-implementation.md](02-dolos-dumpHistory-implementation.md)
- Next: [04-ui-block-accordion.md](04-ui-block-accordion.md)
