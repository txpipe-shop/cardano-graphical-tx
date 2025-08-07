import type { Cardano, CardanoBlock, CardanoTx, CardanoUTxO } from '@/types';
import { type BlockReq, type ChainProvider } from '@/providers/base';
import { Hash } from '@/types/utxo-model';

export type DbSyncParams = {
  connectionString: string;
};

export class DbSyncProvider implements ChainProvider<CardanoUTxO, CardanoTx, Cardano> {
  constructor(params: DbSyncParams) {
    console.log(params);
  }
  async readTip(): Promise<{ hash: Hash; slot: bigint }> {
    return { hash: Hash(''), slot: 1n };
  }

  async getLatestTx(): Promise<CardanoTx> {
    return {
      fee: 1n,
      hash: Hash(''),
      inputs: [],
      mint: {},
      outputs: [],
      referenceInputs: []
    };
  }
  async getBlock({ hash }: BlockReq): Promise<CardanoBlock> {
    return { header: { blockNumber: 1n, chainPoint: { hash, slot: 1n } }, txs: [] };
  }

  async getBlocks(): Promise<CardanoBlock[]> {
    return [];
  }

  async getTx(): Promise<CardanoTx> {
    return {
      fee: 1n,
      hash: Hash(''),
      inputs: [],
      mint: {},
      outputs: [],
      referenceInputs: []
    };
  }

  async getTxs(): Promise<CardanoTx[]> {
    return [];
  }
}
