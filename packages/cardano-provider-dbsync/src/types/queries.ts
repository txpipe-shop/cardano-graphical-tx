/**
 * Query result types for db-sync queries.
 * These match the shape of rows returned by SQL queries.
 */

export interface Tip {
  hash: string;
  slot: string;
  block_height: number;
  epoch: number;
  time: number;
}

export interface Tx {
  hash: string;
  block: string;
  block_height: number;
  block_time: number;
  slot: string;
  index: number;
  fees: string;
  deposit: string;
  size: number;
  invalid_before: string | null;
  invalid_hereafter: string | null;
  valid_contract: boolean;
  // TODO: Add these when queries are complete
  // output_amount: OutputAmount[];
  // utxo_count: number;
  // withdrawal_count: number;
  // mir_cert_count: number;
  // delegation_count: number;
  // stake_cert_count: number;
  // pool_update_count: number;
  // pool_retire_count: number;
  // asset_mint_or_burn_count: number;
  // redeemer_count: number;
}

export interface TxUtxo {
  type: 'input' | 'output';
  tx_hash: string;
  output_index: number;
  address: string;
  amount: string;
  consumed_by_tx_hash: string | null;
  // TODO: Add multi-asset support
  // assets: Asset[];
}

export interface TxCbor {
  cbor: string;
}

export interface OutputAmount {
  unit: string;
  quantity: string;
}

export interface Asset {
  policy_id: string;
  asset_name: string;
  quantity: string;
}
