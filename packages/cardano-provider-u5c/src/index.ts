import {
  BlocksReq,
  BlocksRes,
  EpochsReq,
  EpochsRes,
  TxsRes,
  type ChainProvider,
  type TxReq,
  type TxsReq
} from '@alexandria/provider-core';
import type { Cardano, cardano } from '@alexandria/types';
import { Hash } from '@alexandria/types';
import { UtxoRpcClient } from '@alexandria/utxorpc-sdk';
import type { Transport } from '@connectrpc/connect';
import { getBlockPreviousHash, u5cToCardanoTx } from './mappers';
import assert from 'assert';
import { type cardano as cardanoUtxoRpc, sync } from '@utxorpc/spec';
import { Buffer } from 'buffer';

export type Params = {
  /**
   * Pre-configured transport for the UTxORPC client.
   * Use createGrpcTransport from '@alexandria/utxorpc-sdk/transport/node' for Node.js
   * or from '@alexandria/utxorpc-sdk/transport/web' for browser.
   */
  transport: Transport;
};

export class U5CProvider implements ChainProvider<cardano.UTxO, cardano.Tx, Cardano> {
  utxoRpc: UtxoRpcClient;

  constructor({ transport }: Params) {
    this.utxoRpc = new UtxoRpcClient({ transport });
  }

  async readTip(): Promise<{ hash: Hash; slot: bigint }> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    return {
      hash: Hash(Buffer.from(tip.tip!.hash).toString('hex')),
      slot: BigInt(tip.tip?.slot || 0)
    };
  }

  private async fetchBlock(hash: Buffer<ArrayBuffer>) {
    const req = new sync.FetchBlockRequest({ ref: [new sync.BlockRef({ hash: hash })] });
    const blocks = await this.utxoRpc.sync.fetchBlock(req);
    const block = blocks.block[0];
    assert(block, 'Block not found');
    assert(block.chain.case === 'cardano', 'Chain should be Cardano');
    return { parsedBlock: block.chain.value, nativeBytes: block.nativeBytes };
  }

  async getLatestTx(): Promise<cardano.Tx> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    let hash = Buffer.from(tip.tip!.hash);
    let block: cardanoUtxoRpc.Block;
    let fetchCount = 0;
    do {
      const rawBlock = await this.fetchBlock(hash);
      block = rawBlock.parsedBlock;
      assert(block.header?.hash, 'Block header empty');
      hash = Buffer.from(await getBlockPreviousHash(rawBlock.nativeBytes), 'hex');
      fetchCount++;
    } while (block.body?.tx.length === 0);
    const latestTx = block.body!.tx.at(-1);
    assert(latestTx, 'Latest transaction is undefined');
    const time = block.timestamp;
    const blockHash = block.header.hash;
    const height = block.header.height;

    return u5cToCardanoTx(latestTx, time, Hash(Buffer.from(blockHash).toString('hex')), height);
  }

  async getTx({ hash }: TxReq): Promise<cardano.Tx> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
    assert(txResponse.ledgerTip, 'Ledger tip of transaction empty');
    assert(txResponse.tx?.chain.case === 'cardano', 'Transaction is not a Cardano transaction');
    const tx = txResponse.tx.chain.value;
    const time = txResponse.ledgerTip.timestamp;
    const blockHash = Buffer.from(txResponse.ledgerTip.hash).toString('hex');
    const height = txResponse.ledgerTip.height;
    return u5cToCardanoTx(tx, time, Hash(blockHash), height);
  }

  async getCBOR({ hash }: TxReq): Promise<string> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(hash, 'hex') });
    assert(txResponse.tx?.nativeBytes, 'Empty CBOR of transaction');
    return Buffer.from(txResponse.tx?.nativeBytes).toString('hex');
  }

  async getTxs({ before, limit }: TxsReq): Promise<TxsRes<cardano.UTxO, cardano.Tx, Cardano>> {
    const lastHash = before ?? (await this.getLatestTx()).hash;
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(lastHash, 'hex') });
    assert(
      txResponse.tx?.blockRef?.slot !== undefined,
      'Slot of the transaction blockRef is undefined'
    );
    assert(
      txResponse.tx?.blockRef?.hash !== undefined,
      'Hash of the transaction blockRef is undefined'
    );

    let blockHash: Uint8Array<ArrayBuffer> = txResponse.tx?.blockRef?.hash;
    assert(txResponse.tx?.chain.case === 'cardano', 'Transaction is not a Cardano transaction');
    const blocks: Array<cardanoUtxoRpc.Block> = [];

    do {
      console.log(`About to fetch ${Buffer.from(blockHash).toString('hex')}`);
      const { block: _block } = await this.utxoRpc.sync.fetchBlock(
        new sync.FetchBlockRequest({
          ref: [{ hash: blockHash }]
        })
      );
      const [block] = _block;
      assert(block, 'Block not found');
      assert(block.chain.case === 'cardano', 'Chain should be Cardano');
      blockHash = Buffer.from(await getBlockPreviousHash(block.nativeBytes), 'hex');
      blocks.push(block.chain.value);
    } while (blocks.flatMap((b) => b.body?.tx?.length || 0).reduce((a, c) => a + c, 0) < limit);

    return {
      data: blocks.flatMap(
        (t) =>
          t.body?.tx.map((x) =>
            u5cToCardanoTx(
              x,
              t.timestamp,
              Hash(Buffer.from(t.header!.hash).toString('hex')),
              t.header!.height
            )
          ) || []
      ),
      total: 0n,
      nextCursor: undefined
    };
  }
  async getBlocks(_params: BlocksReq): Promise<BlocksRes> {
    return { data: [], total: 0n, nextCursor: undefined };
  }
  async getEpochs(_params: EpochsReq): Promise<EpochsRes> {
    return { data: [], total: 0n, nextCursor: undefined };
  }
}

export * as mappers from './mappers';
