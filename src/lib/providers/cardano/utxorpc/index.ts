import { type ChainProvider, type LatestTxReq, type TxReq, type TxsReq } from '@/providers/base';
import type { Cardano, CardanoTx, CardanoUTxO } from '@/types';
import { Hash } from '@/types/utxo-model';
import { UtxoRpcClient } from '@/sdk/utxorpc';
import { getBlockPreviousHash, u5cToCardanoTx } from './mappers';
import assert from 'assert';
import { cardano, sync } from '@utxorpc/spec';
import { Buffer } from 'buffer';

export type DolosParams = {
  utxoRpc: {
    uri: string;
    headers?: Record<string, string>;
  };
};

export class DolosProvider implements ChainProvider<CardanoUTxO, CardanoTx, Cardano> {
  utxoRpc: UtxoRpcClient;

  constructor({ utxoRpc }: DolosParams) {
    this.utxoRpc = new UtxoRpcClient({ baseUrl: utxoRpc.uri, headers: utxoRpc.headers });
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
    assert(block.chain.case === 'cardano', 'Chain should be Cardano');
    return { parsedBlock: block.chain.value, nativeBytes: block.nativeBytes };
  }

  async getLatestTx({ maxFetch }: LatestTxReq): Promise<CardanoTx> {
    const tip = await this.utxoRpc.sync.readTip(new sync.ReadTipRequest());
    let hash = Buffer.from(tip.tip!.hash);
    let block: cardano.Block;
    let fetchCount = 0;
    do {
      const rawBlock = await this.fetchBlock(hash);
      block = rawBlock.parsedBlock;
      assert(block.header?.hash, 'Block header empty');
      hash = Buffer.from(await getBlockPreviousHash(rawBlock.nativeBytes), 'hex');
      fetchCount++;
    } while (fetchCount !== maxFetch && block.body?.tx.length === 0);
    assert(
      (block.body?.tx.length || 0) > 0,
      `No transactions found in the latest blocks ${maxFetch}`
    );
    const latestTx = block.body!.tx.at(-1);
    assert(latestTx, 'Latest transaction is undefined');
    const time = block.timestamp;
    const blockHash = block.header.hash;
    const height = block.header.height;

    return u5cToCardanoTx(latestTx, time, Hash(Buffer.from(blockHash).toString('hex')), height);
  }

  async getTx({ hash }: TxReq): Promise<CardanoTx> {
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

  async getTxs({ before, limit }: TxsReq): Promise<CardanoTx[]> {
    const txResponse = await this.utxoRpc.query.readTx({ hash: Buffer.from(before, 'hex') });
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
    const blocks: Array<cardano.Block> = [];

    do {
      console.log(`About to fetch ${Buffer.from(blockHash).toString('hex')}`);
      const { block: _block } = await this.utxoRpc.sync.fetchBlock(
        new sync.FetchBlockRequest({
          ref: [{ hash: blockHash }]
        })
      );
      const [block] = _block;
      assert(block.chain.case === 'cardano', 'Chain should be Cardano');
      blockHash = Buffer.from(await getBlockPreviousHash(block.nativeBytes), 'hex');
      blocks.push(block.chain.value);
    } while (blocks.flatMap((b) => b.body?.tx?.length || 0).reduce((a, c) => a + c, 0) < limit);

    return blocks.flatMap(
      (t) =>
        t.body?.tx.map((x) =>
          u5cToCardanoTx(
            x,
            t.timestamp,
            Hash(Buffer.from(t.header!.hash).toString('hex')),
            t.header!.height
          )
        ) || []
    );
  }
}
