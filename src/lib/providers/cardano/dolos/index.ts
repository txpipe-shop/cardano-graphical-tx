import { CardanoBlocksApi, CardanoTransactionsApi, Configuration } from '$lib/sdk/blockfrost';
import { type ChainProvider, type TxReq, type TxsReq } from '@/providers/base';
import type { Cardano, CardanoTx, CardanoUTxO } from '@/types';
import { Hash } from '@/types/utxo-model';
import { CardanoSyncClient } from '@utxorpc/sdk';
import { bfToCardanoTx } from './blockfrost';
import { u5cToCardanoBlock } from './u5c';

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
    const lastBlock = await this.miniBfBlocksApi.blocksLatestGet();
    const blocks = await this.miniBfBlocksApi.blocksHashOrNumberPreviousGet(
      lastBlock.data.hash,
      100
    );

    const blockWithTx = blocks.data.find((b) => b.tx_count > 0);

    if (!blockWithTx) {
      throw new Error('No blocks with transactions found');
    }

    const txHash = await this.miniBfBlocksApi
      .blocksHashOrNumberTxsGet(blockWithTx.hash, 1, 1, 'desc')
      .then((res) => res.data[0]);

    return this.getTx({ hash: Hash(txHash) });
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
        else return [c + b.tx_count, j + 1]; // keep accumulating transactions
      },
      [0, 0] // (partial tx count, block count)
    );

    const u5cBlocks = await this.syncClient.fetchHistory(
      { hash: tx.data.block, slot: tx.data.slot },
      blockCount
    );

    return u5cBlocks
      .flatMap((b) => {
        return u5cToCardanoBlock(b.parsedBlock).txs;
      })
      .slice(0, limit);
  }
}
