import type { Cardano, CardanoBlock, CardanoTx } from '@/types';
import { type BlockReq, type ChainProvider } from '@/providers/base';
import { Hash } from '@/types/utxo-model';

export class DbSyncProvider implements ChainProvider<Cardano> {
  constructor() { }

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
}
