# Issue 02: Implement `getBlocksWithTxs` in `DolosProvider`

> **good first issue** — This issue is beginner-friendly and a great way to get familiar with the DolosProvider and UTxORPC sync primitives.

## Goal
Implement the new `getBlocksWithTxs` method in `DolosProvider` using UTxORPC `DumpHistory`, returning blocks with fully resolved transactions and cursor-based pagination.

## Background
`DolosProvider` already uses `fetchBlock` and `validateBlock` extensively. `DumpHistory` is the streaming/sync primitive that returns a batch of blocks starting from a given `BlockRef` (cursor) and provides a `nextToken` for pagination. Each returned block contains a full `cardano.Block` with `header`, `body`, and `timestamp`, so transactions can be mapped in-memory without extra RPCs.

## Changes

### File: `packages/cardano-provider-dolos/src/index.ts`

#### 1. Cursor helpers

```ts
private encodeCursor(blockRef: sync.BlockRef): string { }

private decodeCursor(cursor: string): sync.BlockRef {}
```

#### 2. `getBlocksWithTxs` implementation

```ts
async getBlocksWithTxs(
  params: CursorPaginatedRequest<BlocksQuery | undefined>
): Promise<BlocksWithTxsRes<cardano.UTxO, cardano.Tx, Cardano>> { }
```

#### 3. Tip height resolution
`readTip()` currently returns `{ hash, slot }`. `u5cToCardanoBlock` needs `tipHeight` (height, not slot) to compute `confirmations`. Options:
- **Option A:** Change `readTip` to also return `height`. This is a breaking change to `TipRes`.
- **Option B:** Inside `getBlocksWithTxs`, after `readTip()`, call `fetchBlock({ ref: [{ slot: tip.slot }] })` to get the tip block's height. One extra RPC per request.
- **Option C:** Make `confirmations` optional in `BlockMetadata` and skip it when unavailable.

**Recommendation:** Option C — make confirmations optional.

## Acceptance Criteria
- [ ] `DolosProvider` implements `getBlocksWithTxs`.
- [ ] When no cursor is provided, returns the most recent blocks from the tip.
- [ ] `nextCursor` is populated when more blocks exist; absent on the last page.
- [ ] Each returned block contains all its transactions mapped via `u5cToCardanoTx`.
- [ ] `pnpm check` passes.

## Related
- Previous: [01-provider-getBlocksWithTxs.md](01-provider-getBlocksWithTxs.md)
- Next: [03-u5c-dumpHistory-implementation.md](03-u5c-dumpHistory-implementation.md)
- Follow-up: [05-migrate-getBlocks-to-dumpHistory.md](05-migrate-getBlocks-to-dumpHistory.md)
