import type { BaseChain, BaseTx, BaseUTxO } from '@/types';
import type { Hash } from '@/types/utxo-model';

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
  getLatestTx(): Promise<Chain['tx']>;
  getTx(params: TxReq): Promise<Chain['tx']>;
  getTxs(params: TxsReq): Promise<Chain['tx'][]>;
  readTip(): Promise<{
    hash: Hash;
    slot: bigint;
  }>;
}
