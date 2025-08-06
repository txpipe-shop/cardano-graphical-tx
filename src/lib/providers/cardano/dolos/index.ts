import type { Cardano, CardanoBlock, CardanoTx } from '@/types';
import { type BlockReq, type BlocksReq, type ChainProvider, type TxReq } from '@/providers/base';
import { CardanoSyncClient } from '@utxorpc/sdk';
import { CardanoBlocksApi, CardanoTransactionsApi, Configuration } from '$lib/sdk/blockfrost';
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

export class DolosProvider implements ChainProvider<Cardano> {
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

  async getBlock({ hash }: BlockReq): Promise<CardanoBlock> {
    const bfBlock = await this.miniBfBlocksApi.blocksHashOrNumberGet(hash);
    const u5cBlock = await this.syncClient.fetchBlock({ hash, slot: bfBlock.data.slot || 0 });
    return u5cToCardanoBlock(u5cBlock.parsedBlock);
  }

  async getBlocks({ before, limit }: BlocksReq): Promise<CardanoBlock[]> {
    const block = await this.miniBfBlocksApi.blocksHashOrNumberGet(before);
    const blocks = await this.syncClient.fetchHistory(
      { hash: before, slot: block.data.slot || 0 },
      limit
    );
    return blocks.map((b) => u5cToCardanoBlock(b.parsedBlock));
  }

  async getTx({ hash }: TxReq): Promise<CardanoTx> {
    const [tx, utxos] = await Promise.all([
      this.miniBfTxsApi.txsHashGet(hash),
      this.miniBfTxsApi.txsHashUtxosGet(hash)
    ]);
    return bfToCardanoTx(tx.data, utxos.data);
  }
}
