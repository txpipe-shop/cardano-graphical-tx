# Issue 03: Implement `getBlocksWithTxs` in `U5CProvider`

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

#### 2. Cursor helpers (same as Dolos)

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

#### 3. `getBlocksWithTxs` implementation

```ts
async getBlocksWithTxs(
  params: CursorPaginatedRequest<BlocksQuery | undefined>
): Promise<BlocksWithTxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
  const { limit, cursor } = params;

  const request = new sync.DumpHistoryRequest({
    maxItems: Number(limit),
    startToken: cursor ? this.decodeCursor(cursor) : undefined,
  });

  const response = await this.utxoRpc.sync.dumpHistory(request);

  // Need tip height for confirmations. U5CProvider already has fetchBlockByQuery.
  const tip = await this.readTip();
  const { header: tipHeader } = await this.fetchBlockByQuery({ hash: tip.hash });
  const tipHeight = tipHeader.height;

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

## Acceptance Criteria
- [ ] `U5CProvider` implements `getBlocksWithTxs`.
- [ ] Behavior matches `DolosProvider`: cursor round-trip, tip-relative ordering, nested txs.
- [ ] Devnet explorer can consume `getBlocksWithTxs` without falling back to flat `getTxs`.
- [ ] `pnpm check` passes.

## Related
- Previous: [02-dolos-dumpHistory-implementation.md](02-dolos-dumpHistory-implementation.md)
- Next: [04-ui-block-accordion.md](04-ui-block-accordion.md)
