import type { BaseChain, Tx, UTxO, Hash, Address, Value } from '@alexandria/types';

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
export type PaginatedRequest<Cursor, T> = {
  before?: Cursor;
  limit: number;
  query: T;
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
};

export type TxsReq = PaginatedRequest<Hash, TxQuery | undefined>;
export type BlocksReq = PaginatedRequest<Hash, BlocksQuery | undefined>;
export type EpochsReq = PaginatedRequest<Hash, undefined>;
export type AddressFundsReq = { address: Address };
// offset ordered by newest to oldest
export type AddressUTxOsReq = PaginatedRequest<bigint, { address: Address }>;

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
export type AddressFundsRes = { value: Value; txCount: bigint };
export type AddressUTxOsRes<U extends UTxO> = PaginatedResult<U, bigint>;

export interface ChainProvider<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> {
  getLatestTx(): Promise<LatestTxRes<U, T, Chain>>;
  getAddressFunds(params: AddressFundsReq): Promise<AddressFundsRes>;
  getAddressUTxOs(params: AddressUTxOsReq): Promise<AddressUTxOsRes<U>>;
  getTx(params: TxReq): Promise<GetTxRes<U, T, Chain>>;
  getTxs(params: TxsReq): Promise<TxsRes<U, T, Chain>>;
  getBlock(params: BlockReq): Promise<BlockRes>;
  getBlocks(params: BlocksReq): Promise<BlocksRes>;
  getEpochs(params: EpochsReq): Promise<EpochsRes>;
  readTip(): Promise<TipRes>;
}
