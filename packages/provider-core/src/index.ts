import type { BaseChain, Tx, UTxO, Hash, Address } from '@alexandria/types';

export type TxReq = {
  hash: Hash;
};

export type LatestTxReq = {
  /**
   * Amount of blocks to look back for the latest transaction
   * If -1, will search all the way to the genesis block
   */
  maxFetch: number;
};

export type TxQuery = {
  address?: Address;
};

/**
 * Cursor based pagination, if `before` is undefined (gets the `${limit}` latest txs)
 */
export type PaginatedRequest<T> = {
  before?: Hash;
  limit: number;
  query?: T;
};

export type PaginatedResult<T, Cursor> = {
  data: T[];
  total: bigint;
  nextCursor?: Cursor;
};

/**
 * Block overview for lists
 */
export type BlockMetadata = {
  hash: Hash;
  height: bigint;
  slot: bigint;
  txCount: bigint;
  fees: bigint;
  time: number;
  /** blocksProduced since this block */
  confirmations?: bigint;
};

export type WrappedTx<U extends UTxO, T extends Tx<U>> = {
  tx: T;
  epoch: bigint;
  blockHeight: bigint;
};

export type Epoch = {
  index: bigint;
  startSlot: bigint;
  endSlot: bigint;
  startHeight: bigint;
  endHeight: bigint;
  fees: bigint;
  blocksProduced: bigint;
  txCount: bigint;
  blocks: BlockMetadata[];
};

export type TxsReq = PaginatedRequest<TxQuery>;
export type BlocksReq = PaginatedRequest<undefined>;
export type EpochsReq = PaginatedRequest<undefined>;

export type TxsRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = PaginatedResult<Chain['tx'], Hash>;
export type BlocksRes = PaginatedResult<BlockMetadata, Hash>;
export type EpochsRes = PaginatedResult<Epoch, bigint>;

export interface ChainProvider<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> {
  getLatestTx(params: LatestTxReq): Promise<Chain['tx']>;
  getTx(params: TxReq): Promise<Chain['tx']>;
  getTxs(params: TxsReq): Promise<TxsRes<U, T, Chain>>;
  getBlocks(params: BlocksReq): Promise<BlocksRes>;
  getEpochs(params: EpochsReq): Promise<EpochsRes>;
  readTip(): Promise<{
    hash: Hash;
    slot: bigint;
  }>;
}
