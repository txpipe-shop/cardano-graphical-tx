/**
 * Query result types for db-sync queries.
 * These match the shape of rows returned by SQL queries.
 */

export interface Tip {
  hash: string;
  slot: string;
}

export interface Tx {
  hash: string;
  fee: string;
  block: {
    hash: string;
    epochNo: number;
    slot: number;
    height: number;
    txIndex: string;
  };
  createdAt: number;
  inputs: Array<{
    address: string;
    coin: string;
    outRef: { hash: string; index: number };
    value: Record<string, string>;
    consumedBy: string;
    datum?: { type: 'inline' | 'hash'; datumHex?: string; datumHash?: string };
  }>;
  outputs: Array<{
    address: string;
    coin: string;
    outRef: { hash: string; index: number };
    value: Record<string, string>;
    consumedBy?: string | null;
    datum?: { type: 'inline' | 'hash'; datumHex?: string; datumHash?: string };
  }>;
  referenceInputs: Array<{
    address: string;
    coin: string;
    outRef: { hash: string; index: number };
    value: Record<string, string>;
    datum?: { type: 'inline' | 'hash'; datumHex?: string; datumHash?: string };
  }>;
  mint: Record<string, string>;
  metadata: Record<string, string>;
  treasuryDonation: string | null;
  validityInterval: { invalidBefore: string | null; invalidHereafter: string | null };
  witnesses: {
    scripts: Array<{ hash: string; type: string; bytes: string }>;
    redeemers: Array<{
      purpose: string;
      index: number;
      unitMem: number;
      unitSteps: number;
      fee: string | null;
      scriptHash: string;
      redeemerDataHash: string;
    }>;
  };
}

export interface LatestTx {
  result: Tx;
}

export interface Txs {
  result: Tx;
}

export interface TotalTxs {
  total: string;
}

export interface TotalBlocks {
  total: string;
}

export interface TotalEpochs {
  total: string;
}

export interface Block {
  hash: string;
  height: string;
  slot: string;
  time: number;
  txCount: string;
  fees: string;
  confirmations: string;
  size: number;
  slotLeader: string;
}

export interface Epoch {
  epoch: string;
  startTime: number;
  endTime: number;
  txCount: string;
  blkCount: string;
  output: string;
  fees: string;
}

export interface AddressFunds {
  lovelace: string;
  assets: Record<string, string>;
  txCount: string;
}

export interface AddressUTxOs {
  total: string;
  utxos: Array<{
    address: string;
    coin: string;
    outRef: { hash: string; index: number };
    value: Record<string, string>;
    datum?: { type: 'inline' | 'hash'; datumHex?: string; datumHash?: string } | null;
    referenceScript?: { hash: string; type: string; bytes: string } | null;
  }> | null;
}

export interface NetworkStats {
  block_height: number;
  tx_count: string;
  addresses: string;
  avg_block_time: number;
}
