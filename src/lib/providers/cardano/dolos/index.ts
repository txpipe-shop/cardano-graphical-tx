import type { Cardano, CardanoBlock, CardanoTx } from '@/types';
import { type BlockReq, type BlocksReq, type ChainProvider, type TxReq } from '@/providers/base';
import { CardanoSyncClient } from '@utxorpc/sdk';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
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
  miniBf: BlockFrostAPI;

  constructor({ utxoRpc, miniBf }: DolosParams) {
    this.syncClient = new CardanoSyncClient(utxoRpc);
    // TODO: find out how to pass custom headers through the Blockfrost SDK
    this.miniBf = new BlockFrostAPI({ customBackend: miniBf.uri });
  }

  async getBlock({ hash }: BlockReq): Promise<CardanoBlock> {
    const bfBlock = await this.miniBf.blocks(hash);
    const u5cBlock = await this.syncClient.fetchBlock({ hash, slot: bfBlock.slot || 0 });
    return u5cToCardanoBlock(u5cBlock.parsedBlock);
  }

  async getBlocks({ before, limit }: BlocksReq): Promise<CardanoBlock[]> {
    const block = await this.miniBf.blocks(before);
    const blocks = await this.syncClient.fetchHistory(
      { hash: before, slot: block.slot || 0 },
      limit
    );
    return blocks.map((b) => u5cToCardanoBlock(b.parsedBlock));
  }

  async getTx({ hash }: TxReq): Promise<CardanoTx> {
    const [tx, utxos] = await Promise.all([this.miniBf.txs(hash), this.miniBf.txsUtxos(hash)]);
    return bfToCardanoTx(tx, utxos);
  }
}
