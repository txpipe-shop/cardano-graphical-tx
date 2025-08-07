import type { BaseChain, BaseTx, BaseUTxO } from '@/types';
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

export type TxsReq = {
  before: Hash;
  limit: number;
};

export interface ChainProvider<
  U extends BaseUTxO,
  T extends BaseTx<U>,
  Chain extends BaseChain<U, T>
> {
  getBlock(params: BlockReq): Promise<Chain['block']>;
  getBlocks(params: BlocksReq): Promise<Chain['block'][]>;
  getLatestTx(): Promise<Chain['tx']>;
  getTx(params: TxReq): Promise<Chain['tx']>;
  getTxs(params: TxsReq): Promise<Chain['tx'][]>;
  readTip(): Promise<{
    hash: Hash;
    slot: bigint;
  }>;
}
