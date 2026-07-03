import type {
  Address,
  BaseChain,
  Hash,
  HexString,
  Tx,
  Unit,
  UTxO,
  Value
} from '@laceanatomy/types';

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

export type CursorPaginatedRequest<Cursor> = {
  /** Cursor from the previous page response, or undefined for the first page. */
  cursor?: Cursor;
  limit: bigint;
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
  size?: bigint;
  epoch?: bigint;
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

export type Pool = {
  poolId: string;
  hex: string;
  ticker?: string | null;
  name?: string | null;
  description?: string | null;
  homepage?: string | null;
  logo?: string | null;
  meta?: {
    name?: string | null;
    ticker?: string | null;
    description?: string | null;
    homepage?: string | null;
    logo?: string | null;
  } | null;
  stake?: string | null;
  delegators?: number | null;
  margin?: number | null;
  fixed_cost?: string | null;
  cost?: string | null;
  pledge?: string | null;
};

export type PoolsQuery = {
  search?: string;
};

export type PoolsReq = PaginatedRequest<PoolsQuery | undefined>;
export type PoolReq = { id: string };

export type PoolsRes = PaginatedResult<Pool> & {
  totals?: {
    total_pools?: number;
    total_stake?: string;
    total_delegators?: number;
  };
};
export type PoolRes = Pool;

export type TxsReq = PaginatedRequest<TxQuery | undefined>;
export type BlocksReq = PaginatedRequest<BlocksQuery | undefined>;
export type EpochsReq = PaginatedRequest<undefined>;
export type AddressFundsReq = { address: Address };
export type AddressUTxOsReq = PaginatedRequest<{ address: Address }>;

export type BlockWithTxs<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> = {
  block: BlockMetadata;
  transactions: Chain['tx'][];
};

export type BlocksWithTxsRes<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> = {
  data: BlockWithTxs<U, T, Chain>[];
};

export type BlockRes = BlockMetadata;
export type TxsRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = PaginatedResult<Chain['tx']>;
export type BlocksRes = PaginatedResult<BlockMetadata>;
export type EpochsRes = PaginatedResult<Epoch>;
export type TipRes = { hash: Hash; slot: bigint; height: bigint };
export type BlockCursor = { hash: Hash } | { slot: bigint } | { height: bigint };
export type LatestTxRes<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>
> = Chain['tx'];
export type GetTxRes<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> = Chain['tx'];
export type AddressFundsRes = {
  value: Value;
  txCount: bigint;
  firstSeen?: { blockHeight: bigint; slot: bigint; hash: Hash; title?: string };
  lastSeen?: { blockHeight: bigint; slot: bigint; hash: Hash; title?: string };
};
export type AddressUTxOsRes<U extends UTxO> = PaginatedResult<U>;
export type EpochRes = Epoch;

export type TokenMetadataShapes = Record<string, Record<string, unknown>>;

export type Nullable<T> = { [K in keyof T]: T[K] | null };

export type AssetMetadata = {
  name: string;
  description: string;
  ticker: string | null;
  url: string | null;
  logo: string | null;
  decimals: number | null;
};

export type AssetInfoRes = {
  policyId: HexString;
  assetName: HexString;
  fingerprint: string;
  totalSupply: string;
  mintOrBurnCount: number;
  initialMintTxHash: Hash;
  metadata: AssetMetadata | null;
  onchainMetadata: Record<string, unknown> | null;
  onchainMetadataStandard: string | null;
};

export type AssetAddressesRes = Array<{ address: Address; quantity: string }>;

export type AssetHistoryRes = Array<{ txHash: Hash; action: 'minted' | 'burned'; amount: string }>;

export type AssetTransactionsRes = Array<{
  txHash: Hash;
  txIndex: number;
  blockHeight: number;
  blockTime: number;
}>;

export interface ChainProvider<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>,
  Shapes extends TokenMetadataShapes = TokenMetadataShapes
> {
  getCBOR(params: TxReq): Promise<string>;
  getBlockCBOR?(params: BlockReq): Promise<string>;
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
  getPools?(params: PoolsReq): Promise<PoolsRes>;
  getPool?(params: PoolReq): Promise<PoolRes>;
  getTokenMetadata?(params: {
    unit: Unit;
    type?: keyof Shapes | 'all';
    network?: 'mainnet' | 'preprod';
  }): Promise<Nullable<Shapes>>;
  getAssetInfo?(asset: Unit): Promise<AssetInfoRes>;
  getAssetAddresses?(asset: Unit, count: number, page: number): Promise<AssetAddressesRes>;
  getAssetHistory?(asset: Unit, count: number, page: number): Promise<AssetHistoryRes>;
  getAssetTransactions?(
    asset: Unit,
    count: number,
    page: number,
    order?: 'asc' | 'desc'
  ): Promise<AssetTransactionsRes>;
}

export interface CursorPaginatedProvider<
  U extends UTxO,
  T extends Tx<U>,
  Chain extends BaseChain<U, T>,
  Cursor
> {
  getBlocksWithTxs(params: CursorPaginatedRequest<Cursor>): Promise<BlocksWithTxsRes<U, T, Chain>>;
}
