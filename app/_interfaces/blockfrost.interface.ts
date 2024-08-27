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

export interface IBlockfrostResponse {
  hash: string;
  inputs: Input[];
  outputs: Output[];
}
