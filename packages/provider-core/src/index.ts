import type { Address, BaseChain, Hash, Tx, UTxO, Value } from '@laceanatomy/types';

export type EpochReq = { epochNo: bigint };

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
 * Offset based pagination, ordered by newest first.
 * If `offset` is undefined, gets the `${limit}` latest items.
 */
export type PaginatedRequest<T> = {
  offset?: bigint;
  limit: bigint;
  query: T;
};

export type PaginatedResult<T> = {
  data: T[];
  total: bigint;
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
  confirmations: bigint;
};

// TODO: think how to handle epochs in generic chains (currently cardano focused)
// Same thing with Hydra (no blocks)
export type Epoch = {
  index: bigint;
  startSlot: bigint;
  endSlot: bigint;
  startHeight: bigint;
  endHeight: bigint;
  startTime: number;
  endTime: number;
  fees: bigint;
  blocksProduced: bigint;
  txCount: bigint;
};

export type TxsReq = PaginatedRequest<TxQuery | undefined>;
export type BlocksReq = PaginatedRequest<BlocksQuery | undefined>;
export type EpochsReq = PaginatedRequest<undefined>;
export type AddressFundsReq = { address: Address };
export type AddressUTxOsReq = PaginatedRequest<{ address: Address }>;

export type BlockRes = BlockMetadata;
export type TxsRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = PaginatedResult<Chain['tx']>;
export type BlocksRes = PaginatedResult<BlockMetadata>;
export type EpochsRes = PaginatedResult<Epoch>;
export type TipRes = { hash: Hash; slot: bigint };
export type LatestTxRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = Chain['tx'];
export type GetTxRes<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> = Chain['tx'];
export type AddressFundsRes = { value: Value; txCount: bigint };
export type AddressUTxOsRes<U extends UTxO> = PaginatedResult<U>;
export type EpochRes = Epoch;

export interface ChainProvider<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> {
  getLatestTx(): Promise<LatestTxRes<U, T, Chain>>;
  getAddressFunds(params: AddressFundsReq): Promise<AddressFundsRes>;
  getAddressUTxOs(params: AddressUTxOsReq): Promise<AddressUTxOsRes<U>>;
  getTx(params: TxReq): Promise<GetTxRes<U, T, Chain>>;
  getTxs(params: TxsReq): Promise<TxsRes<U, T, Chain>>;
  getBlock(params: BlockReq): Promise<BlockRes>;
  getBlocks(params: BlocksReq): Promise<BlocksRes>;
  getEpoch(params: EpochReq): Promise<EpochRes>;
  getEpochs(params: EpochsReq): Promise<EpochsRes>;
  readTip(): Promise<TipRes>;
}
