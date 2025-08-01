import type { BaseChain } from '@/types';
import type { Hash } from '@/types/utxo-model';

export type BlockReq = {
  hash: Hash;
};

export type BlocksReq = {
  before: Hash;
  limit: number;
};

export type TxReq = {
  hash: Hash;
};

export interface ChainProvider<Chain extends BaseChain> {
  getBlock(params: BlockReq): Promise<Chain['block']>;
  getBlocks(params: BlocksReq): Promise<Chain['block'][]>;
  getTx(params: TxReq): Promise<Chain['tx']>;
}
