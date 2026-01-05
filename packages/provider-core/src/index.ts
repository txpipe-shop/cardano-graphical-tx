import type { BaseChain, Tx, UTxO, Hash, Address } from '@alexandria/types';

export type BlockReq = { hash: Hash } | { height: bigint } | { slot: bigint };

export type TxReq = { hash: Hash };

export type TxQuery = {
  /** Filter transactions if it involves this address in any of its inputs or outputs */
  address?: Address;
  block?: { hash: Hash } | { height: bigint } | { slot: bigint };
};

export type BlocksQuery = {
  epoch?: bigint;
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

// TODO: think how to handle epochs in generic chains (currently cardano focused)
// Same thing with Hydra (no blocks)
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
export type BlocksReq = PaginatedRequest<BlocksQuery>;
export type EpochsReq = PaginatedRequest<undefined>;
export type BlockRes = BlockMetadata;

export type TxsRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = PaginatedResult<Chain['tx'], Hash>;
export type BlocksRes = PaginatedResult<BlockMetadata, Hash>;
export type EpochsRes = PaginatedResult<Epoch, bigint>;
export type TipRes = { hash: Hash; slot: bigint };
export type LatestTxRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = Chain['tx'];
export type GetTxRes<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> = Chain['tx'];

export interface ChainProvider<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> {
  getLatestTx(): Promise<LatestTxRes<U, T, Chain>>;
  getTx(params: TxReq): Promise<GetTxRes<U, T, Chain>>;
  getTxs(params: TxsReq): Promise<TxsRes<U, T, Chain>>;
  getBlock(params: BlockReq): Promise<BlockRes>;
  getBlocks(params: BlocksReq): Promise<BlocksRes>;
  getEpochs(params: EpochsReq): Promise<EpochsRes>;
  readTip(): Promise<TipRes>;
}
