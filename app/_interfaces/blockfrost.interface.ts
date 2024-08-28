interface Amount {
  unit: string;
  quantity: string;
}

interface Input {
  address: string;
  amount: Amount[];
  tx_hash: string;
  output_index: number;
  data_hash: string | null;
  inline_datum: string | null;
  reference_script_hash: string | null;
  collateral: boolean;
  reference?: boolean;
}

interface Output {
  address: string;
  amount: Amount[];
  output_index: number;
  data_hash: string | null;
  inline_datum: string | null;
  collateral: boolean;
  reference_script_hash: string | null;
}

interface OutputAmount {
  unit: string;
  quantity: string;
}

interface Redeemer {
  tx_index: number;
  purpose: string;
  script_hash: string;
  redeemer_data_hash: string;
  unit_mem: string;
  unit_steps: string;
  fee: string;
}

interface Metadata {
  label: string;
  json_metadata: string;
}

interface Metadata {
  label: string;
  cbor_metadata: string;
  metadata: string;
}
export interface IBlockfrostResponse {
  // parameters for the UTxO response
  hash: string;
  inputs: Input[];
  outputs: Output[];
  // parameters for the Tx response
  block: string;
  block_height: number;
  block_time: number;
  slot: number;
  index: number;
  output_amount: OutputAmount[];
  fees: string;
  deposit: string;
  size: number;
  invalid_before: string | null;
  invalid_hereafter: string | null;
  utxo_count: number;
  withdrawal_count: number;
  mir_cert_count: number;
  delegation_count: number;
  stake_cert_count: number;
  pool_update_count: number;
  pool_retire_count: number;
  asset_mint_or_burn_count: number;
  redeemer_count: number;
  valid_contract: boolean;
  metadata: Metadata[];
  redeemers: Redeemer[];
}
