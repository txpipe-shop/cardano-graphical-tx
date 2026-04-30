---
name: Utxorpc
description: It's a grpc endpoint that returns information from cardano. There is a typescript sdk and a spec (with protobuf generated types).
license: MIT
---

## Context

This skill documents how to use UTxORPC (u5c) gRPC calls in the `cardano-graphical-tx` monorepo. UTxORPC is a gRPC endpoint that returns blockchain information from Cardano. The monorepo wraps the upstream `@utxorpc/spec` package in `@laceanatomy/utxorpc-sdk` and consumes it via `cardano-provider-u5c` and `cardano-provider-dolos`.

## Architecture

### `UtxoRpcClient`

The SDK exposes a single client class with four service namespaces:

```ts
import { UtxoRpcClient } from '@laceanatomy/utxorpc-sdk';

const client = new UtxoRpcClient({ transport });

client.query; // QueryService   — readUtxos, searchUtxos, readTx, etc.
client.submit; // SubmitService  — submitTx, watchMempool, etc.
client.sync; // SyncService    — readTip, fetchBlock, dumpHistory, etc.
client.watch; // WatchService   — stream UTxO / block updates
```

All protobuf-generated types are re-exported from `@utxorpc/spec`:

```ts
import { query, sync, submit, watch, type cardano as cardanoUtxoRpc } from '@utxorpc/spec';
```

### Transport creation

Transport must be created for the target runtime and injected into the client:

```ts
// Node.js
import { createGrpcTransport } from '@laceanatomy/utxorpc-sdk/transport/node';

const transport = createGrpcTransport({
  httpVersion: '2',
  baseUrl: 'http://localhost:50051',
  interceptors: [
    (next) => async (req) => {
      req.header.set('api-key', process.env.UTXORPC_API_KEY);
      return next(req);
    }
  ]
});
```

```ts
// Browser
import { createGrpcTransport } from '@laceanatomy/utxorpc-sdk/transport/web';

const transport = createGrpcTransport({
  baseUrl: 'https://utxorpc.example.com',
  interceptors: []
});
```

### Key protobuf types

| Type                                               | Purpose                                                     |
| -------------------------------------------------- | ----------------------------------------------------------- |
| `sync.FetchBlockRequest` / `FetchBlockResponse`    | Fetch one or more blocks by `BlockRef`                      |
| `sync.DumpHistoryRequest` / `DumpBlockResponse`    | Stream blocks from tip toward genesis                       |
| `sync.ReadTipRequest` / `ReadTipResponse`          | Get the current chain tip                                   |
| `query.ReadTxRequest` / `ReadTxResponse`           | Read a single tx by hash                                    |
| `query.SearchUtxosRequest` / `SearchUtxosResponse` | Search UTxOs by address or pattern                          |
| `sync.BlockRef`                                    | Identifies a block by `hash`, `height`, or `slot`           |
| `sync.AnyChainBlock`                               | Polymorphic wrapper; unwrap with `chain.case === 'cardano'` |
| `cardanoUtxoRpc.Block`                             | Concrete Cardano block (header + body + timestamp)          |

## Block validation pattern

Both `U5CProvider` and `DolosProvider` use the same `validateBlock` helper. Always use this instead of hand-unwrapping responses:

```ts
import { sync, type cardano as cardanoUtxoRpc } from '@utxorpc/spec';
import assert from 'assert';

function validateBlock(block: sync.FetchBlockResponse | sync.AnyChainBlock): {
  block: cardanoUtxoRpc.Block;
  header: cardanoUtxoRpc.BlockHeader;
  body: cardanoUtxoRpc.BlockBody;
} {
  let thisBlock: sync.AnyChainBlock;
  if ('block' in block) {
    assert(block.block[0], 'Block not found');
    thisBlock = block.block[0];
  } else {
    thisBlock = block;
  }

  assert(thisBlock.chain.case === 'cardano', 'Block is not a Cardano block');
  assert(thisBlock.chain.value.body, 'Block body is undefined');
  assert(thisBlock.chain.value.header, 'Block header is undefined');

  return {
    block: thisBlock.chain.value,
    header: thisBlock.chain.value.header,
    body: thisBlock.chain.value.body
  };
}
```

Key points:

- `FetchBlockResponse.block` is an **array**; providers usually call with one ref and take index `0`.
- `AnyChainBlock.chain` is a protobuf `oneof`; always assert `case === 'cardano'` before accessing `value`.
- `header`, `body`, and `timestamp` live on `thisBlock.chain.value` (the `cardanoUtxoRpc.Block`).

## Mapping helpers

The `cardano-provider-u5c/mappers` package provides canonical converters. **Always use these instead of hand-rolling mappings.**

```ts
import {
  u5cToCardanoBlock,
  u5cToCardanoTx,
  u5cToCardanoUtxo,
  u5cToCardanoValue,
  u5cToCardanoMetadata
} from '@laceanatomy/cardano-provider-u5c/mappers';
```

### `u5cToCardanoBlock(block, tipHeight)` → `BlockRes`

Converts a `cardanoUtxoRpc.Block` into the internal `BlockRes` shape, computing `confirmations` as `tipHeight - blockHeight`.

### `u5cToCardanoTx(tx, timestamp, blockHash, blockHeight, blockSlot, indexInBlock)` → `cardano.Tx`

Converts a `cardanoUtxoRpc.Tx` into the internal `cardano.Tx` type. The `indexInBlock` must be computed by looking up the tx hash inside `blockBody.tx`.

### `u5cToCardanoUtxo(hash, output, index)` → `cardano.UTxO`

Converts a single `cardanoUtxoRpc.TxOutput` (or `asOutput` from a resolved input) into a `cardano.UTxO`.

### `u5cToCardanoValue(outputs)` → `Value`

Aggregates lovelace and native asset quantities from an array of `TxOutput`s.

## Common pitfalls

1. **`dumpHistory` returns blocks from tip toward genesis by default.**
   - Use `startToken: { slot: 0n }` to start from genesis, or paginate backward from the tip.
   - Response includes `nextToken`; treat it as a cursor for pagination.

2. **`BlockRef` fields are protobuf `uint64`; use `bigint` in TypeScript.**
   - `height` and `slot` are `bigint`. Do not cast to `Number` without checking bounds.

3. **`fetchBlock` accepts an array of refs but providers usually call with one.**
   - The response is `FetchBlockResponse { block: AnyChainBlock[] }`.
   - Most provider code sends `[{ hash }]` or `[{ height }]` and reads `block[0]`.

4. **`body.tx` in fetched blocks contains fully resolved transactions.**
   - `tx.inputs` already have `asOutput` populated (the resolved UTxO being spent).
   - This means you do not need a second lookup to render input details.

5. **`Buffer` vs `Uint8Array` for hashes.**
   - The protobuf layer expects `Uint8Array`. Use `Buffer.from(hashHex, 'hex')` (which returns a `Uint8Array` subclass) for hex conversions.
   - Convert back with `Buffer.from(uint8).toString('hex')`.

6. **`ReadTxResponse` validation.**
   - Always assert `txResponse.tx.chain.case === 'cardano'`.
   - `txResponse.tx.nativeBytes` contains the raw CBOR if you need `getCBOR`.

## Related files

- `packages/utxorpc-sdk/src/index.ts` — client definition and re-exports
- `packages/utxorpc-sdk/src/grpcTransport.node.ts` — Node transport
- `packages/utxorpc-sdk/src/grpcTransport.web.ts` — browser transport
- `packages/cardano-provider-u5c/src/index.ts` — pure UTxORPC provider
- `packages/cardano-provider-u5c/src/mappers.ts` — canonical mapping helpers
- `packages/cardano-provider-dolos/src/index.ts` — hybrid Blockfrost + UTxORPC provider
