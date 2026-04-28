# Issue 01: Extend provider-core with cursor-based block+txs types

## Goal
Add new types and an optional provider method that return blocks together with their fully resolved transactions, using cursor-based pagination instead of offset-based.

## Motivation
The current `getTxs` returns a flat list of transactions. For the new explorer UI we need blocks as the primary unit, with transactions nested inside. A cursor-based API fits `UTxORPC DumpHistory` natively and avoids the N+1 problem of fetching blocks then txs separately.

## Changes

### New types in `packages/provider-core/src/index.ts`

```ts
export type CursorPaginatedRequest<T> = {
  /** Opaque cursor for pagination. Dolos will base64-encode a BlockRef. */
  cursor?: string;
  limit: bigint;
  query: T;
};

export type BlockWithTxs<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = {
  block: BlockMetadata;
  transactions: Chain['tx'][];
};

export type BlocksWithTxsRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = {
  data: BlockWithTxs<U, T, Chain>[];
  /** Cursor for the next page, if more blocks exist. */
  nextCursor?: string;
};
```

### Extend `ChainProvider` interface

Add an optional method so existing providers (`DbSyncProvider`) are not broken:

```ts
getBlocksWithTxs?(
  params: CursorPaginatedRequest<BlocksQuery | undefined>
): Promise<BlocksWithTxsRes<U, T, Chain>>;
```

## Acceptance Criteria
- [ ] `CursorPaginatedRequest`, `BlockWithTxs`, and `BlocksWithTxsRes` are exported from `provider-core`.
- [ ] `ChainProvider` optionally declares `getBlocksWithTxs`.
- [ ] No breaking changes to existing methods or types.
- [ ] `pnpm check` passes across the workspace.

## Related
- Next: [02-dolos-dumpHistory-implementation.md](02-dolos-dumpHistory-implementation.md)
