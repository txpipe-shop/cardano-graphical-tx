# Issue 05: Migrate `DolosProvider.getBlocks` to `DumpHistory`

## Goal
Migrate the existing `getBlocks` method in `DolosProvider` from Blockfrost to UTxORPC `DumpHistory`, achieving consistency with `getBlocksWithTxs` and removing the Blockfrost dependency from the blocks path.

## Background
`DolosProvider.getBlocks` currently:
1. Calls Blockfrost `blocksLatestGet` to find the tip.
2. Computes a list of heights.
3. Calls Blockfrost `blocksHashOrNumberGet` for each height in parallel.
4. Maps Blockfrost responses to `BlockMetadata`.

`DumpHistory` can do this in a single RPC, returns cursor-based pagination natively, and does not require Blockfrost.

## Scope
- Replace Blockfrost calls in `getBlocks` with `this.utxoRpc.sync.dumpHistory`.
- Adapt `BlocksReq` (offset/limit) to cursor semantics, or keep offset/limit for backward compatibility.
  - **Option A:** Keep `BlocksReq` as-is and internally translate `offset` into walking back N blocks from the tip. This preserves the existing API but is slightly inefficient.
  - **Option B:** Change `BlocksReq` to accept an optional cursor. This is a breaking change to the interface.
  - **Recommendation:** Option A for minimal risk. We can add cursor support later if needed.
- Map returned `AnyChainBlock`s to `BlockMetadata` using `u5cToCardanoBlock`.
- Remove `CardanoBlocksApi` usage from `getBlocks` (but keep the import if other methods still need it).

## Acceptance Criteria
- [ ] `getBlocks` no longer calls Blockfrost `blocksLatestGet` or `blocksHashOrNumberGet`.
- [ ] Pagination still works correctly via offset/limit.
- [ ] All existing consumers (explorer, any tRPC routes) continue to work without changes.
- [ ] `pnpm check` passes.

## Non-Goals
- Do not remove `CardanoBlocksApi` entirely if `getTxsByAddress` or other methods still use it.
- Do not change `getLatestTxs` in this issue (can be a separate follow-up).

## Related
- Previous: [04-ui-block-accordion.md](04-ui-block-accordion.md)
