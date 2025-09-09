import { CardanoBlocksApi, CardanoTransactionsApi, Configuration } from '$lib/sdk/blockfrost';
import { type ChainProvider, type TxReq, type TxsReq } from '@/providers/base';
import type { Cardano, CardanoTx, CardanoUTxO } from '@/types';
import { Hash } from '@/types/utxo-model';
import { CardanoSyncClient } from '@utxorpc/sdk';
import { bfToCardanoTx } from './blockfrost';
import { u5cToCardanoBlock, u5cToCardanoTx } from './u5c';

export type DolosParams = {
  utxoRpc: {
    uri: string;
    headers?: Record<string, string>;
  };
  miniBf: {
    uri: string;
    headers?: Record<string, string>;
  };
};

export class DolosProvider implements ChainProvider<CardanoUTxO, CardanoTx, Cardano> {
  syncClient: CardanoSyncClient;
  miniBfBlocksApi: CardanoBlocksApi;
  miniBfTxsApi: CardanoTransactionsApi;

  constructor({ utxoRpc, miniBf }: DolosParams) {
    this.syncClient = new CardanoSyncClient(utxoRpc);
    const config = new Configuration({
      basePath: miniBf.uri,
      baseOptions: { headers: miniBf.headers }
    });
    this.miniBfBlocksApi = new CardanoBlocksApi(config);
    this.miniBfTxsApi = new CardanoTransactionsApi(config);
  }

  async readTip(): Promise<{ hash: Hash; slot: bigint }> {
    const tip = await this.miniBfBlocksApi.blocksLatestGet();
    return { hash: Hash(tip.data.hash), slot: BigInt(tip.data.slot!) };
  }

  async getLatestTx(): Promise<CardanoTx> {
    // obviously this is awful
    const tip = await this.miniBfBlocksApi.blocksLatestGet();
    const blocks = await this.miniBfBlocksApi.blocksHashOrNumberPreviousGet(tip.data.hash, 100);
    const blockWithTx = blocks.data.find((b) => b.tx_count > 0);

    if (!blockWithTx) {
      throw new Error('No blocks with transactions found');
    }

    const txsAtBlock = await this.syncClient.fetchBlock({
      hash: blockWithTx.hash,
      slot: blockWithTx.slot!
    });

    return u5cToCardanoTx(txsAtBlock.parsedBlock.body!.tx.at(-1)!);
  }

  async getTx({ hash }: TxReq): Promise<CardanoTx> {
    const [tx, utxos] = await Promise.all([
      this.miniBfTxsApi.txsHashGet(hash),
      this.miniBfTxsApi.txsHashUtxosGet(hash)
    ]);
    return bfToCardanoTx(tx.data, utxos.data);
  }

  async getTxs({ before, limit }: TxsReq): Promise<CardanoTx[]> {
    const tx = await this.miniBfTxsApi.txsHashGet(before);
    const blocks = await this.miniBfBlocksApi.blocksHashOrNumberPreviousGet(tx.data.block, 100);
    const [, blockCount]: [number, number] = blocks.data.reduce(
      ([c, i], b, j) => {
        if (c >= limit) return [c, i];
        // max allowed by dolos is 100
        else if (i === 100) return [c, i];
        // keep accumulating transactions
        else return [c + b.tx_count, j + 1];
      },
      // (partial tx count, block count)
      [0, 0]
    );

    // this endpoint doesn't work ¯\_(ツ)_/¯
    //const u5cBlocks = await this.syncClient.fetchHistory(
    //  { hash: tx.data.block, slot: tx.data.slot },
    //  blockCount
    //);

    //return u5cBlocks.flatMap((b) => u5cToCardanoBlock(b.parsedBlock).txs).slice(0, limit);

    const u5cBlocks = await Promise.all(
      blocks.data
        .slice(0, blockCount)
        .map((b) => this.syncClient.fetchBlock({ hash: b.hash, slot: b.slot! }))
    );
    return u5cBlocks.flatMap((b) => u5cToCardanoBlock(b.parsedBlock).txs).slice(0, limit);
  }
}
