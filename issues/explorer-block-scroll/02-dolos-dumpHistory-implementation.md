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
private encodeCursor(blockRef: sync.BlockRef): string {
  return Buffer.from(JSON.stringify({
    slot: Number(blockRef.slot),
    hash: Buffer.from(blockRef.hash).toString('hex'),
    height: Number(blockRef.height),
    timestamp: Number(blockRef.timestamp),
  })).toString('base64');
}

private decodeCursor(cursor: string): sync.BlockRef {
  const parsed = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
  return new sync.BlockRef({
    slot: BigInt(parsed.slot),
    hash: Buffer.from(parsed.hash, 'hex'),
    height: BigInt(parsed.height),
    timestamp: BigInt(parsed.timestamp),
  });
}
```

#### 2. `getBlocksWithTxs` implementation

```ts
async getBlocksWithTxs(
  params: CursorPaginatedRequest<BlocksQuery | undefined>
): Promise<BlocksWithTxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
  const { limit, cursor } = params;

  const request = new sync.DumpHistoryRequest({
    maxItems: Number(limit),
    startToken: cursor ? this.decodeCursor(cursor) : undefined,
  });

  const [response, tip] = await Promise.all([
    this.utxoRpc.sync.dumpHistory(request),
    this.readTip(),
  ]);

  const tipHeight = tip.slot; // readTip currently returns slot; we may need readTip to return height too
  // TODO: verify tipHeight is actually height; if readTip only gives slot,
  // we may need an extra fetchBlock({ref:[{slot:tip.slot}]}) to get height.

  const data = response.block.map((anyChainBlock) => {
    const { block, header, body } = this.validateBlock(anyChainBlock);
    const blockMeta = u5cToCardanoBlock(block, tipHeight);
    const transactions = body.tx.map((tx) =>
      u5cToCardanoTx(
        tx,
        block.timestamp,
        blockMeta.hash,
        header.height,
        header.slot,
        this.findTxIndexInBlock(body, tx)
      )
    );
    return { block: blockMeta, transactions };
  });

  return {
    data,
    nextCursor: response.nextToken ? this.encodeCursor(response.nextToken) : undefined,
  };
}
```

#### 3. Tip height resolution
`readTip()` currently returns `{ hash, slot }`. `u5cToCardanoBlock` needs `tipHeight` (height, not slot) to compute `confirmations`. Options:
- **Option A:** Change `readTip` to also return `height`. This is a breaking change to `TipRes`.
- **Option B:** Inside `getBlocksWithTxs`, after `readTip()`, call `fetchBlock({ ref: [{ slot: tip.slot }] })` to get the tip block's height. One extra RPC per request.
- **Option C:** Make `confirmations` optional in `BlockMetadata` and skip it when unavailable.

**Recommendation:** Option B — call `fetchBlock` for tip height. It is one extra unary RPC and keeps `TipRes` stable.

## Acceptance Criteria
- [ ] `DolosProvider` implements `getBlocksWithTxs`.
- [ ] Cursor encoding/decoding round-trips correctly through base64 JSON.
- [ ] When no cursor is provided, returns the most recent blocks from the tip.
- [ ] `nextCursor` is populated when more blocks exist; absent on the last page.
- [ ] Each returned block contains all its transactions mapped via `u5cToCardanoTx`.
- [ ] `pnpm check` passes.

## Related
- Previous: [01-provider-getBlocksWithTxs.md](01-provider-getBlocksWithTxs.md)
- Next: [03-u5c-dumpHistory-implementation.md](03-u5c-dumpHistory-implementation.md)
- Follow-up: [05-migrate-getBlocks-to-dumpHistory.md](05-migrate-getBlocks-to-dumpHistory.md)
