export interface Redeemers {
  spends: RedeemerSpend[];
  mints: any[];
  withdrawals: any[];
}

export interface RedeemerSpend {
  script_hash: string;
  input: {
    tx_hash: string;
    index: number;
  };
  input_index: number;
  data: Data;
  ex_units: number[]; // memory & steps
}

interface Data {
  json: Record<string, any>;
  bytes: string;
}
interface ICborInput {
  txHash: string;
  index: number;
}

export interface ICborDatum {
  hash: string;
  bytes: string;
  json: Record<string, any>;
}

export interface ICborAsset {
  policyId: string;
  assetName: string;
  amount: number | bigint;
}

export interface IUtxo {
  txHash: string;
  index: number;
  address: string;
  assets: ICborAsset[];
  datum?: ICborDatum;
}

export interface ITransaction {
  txHash: string;
  fee: number;
  inputs: ICborInput[];
  referenceInputs: ICborInput[];
  outputs: IUtxo[];
  mints: ICborAsset[];
  scriptsSuccessful: boolean;
  blockHash?: string;
  blockTxIndex?: number;
  blockHeight?: number;
  blockAbsoluteSlot?: number;
  invalidBefore?: number;
  invalidHereafter?: number;
  withdrawals?: any[];
  redeemers?: Redeemers;
  metadata?: any;
  size?: number;
}
