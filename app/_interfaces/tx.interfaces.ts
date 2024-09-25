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
export interface IDatum {
  hash: string;
  bytes: string;
  json: Record<string, any>;
}

export interface IAsset {
  policyId: string;
  assetName: string;
  amount: number | bigint;
}

export interface IUtxo {
  txHash: string;
  index: number;
  address: string;
  assets: IAsset[];
  datum?: IDatum;
  scriptRef?: string;
}

export interface IWithdrawal {
  rawAddress: string;
  amount: string;
}
export interface IMetadata {
  label: string;
  jsonMetadata: Record<string, string>;
}

export interface ICertificate {
  json: Record<string, any>;
}

export interface ITransaction {
  txHash: string;
  fee: number;
  inputs: IUtxo[];
  referenceInputs: IUtxo[];
  outputs: IUtxo[];
  mints: IAsset[];
  scriptsSuccessful: boolean;
  blockHash?: string;
  blockTxIndex?: number;
  blockHeight?: number;
  blockAbsoluteSlot?: number;
  validityStart?: number;
  ttl?: number;
  withdrawals?: IWithdrawal[];
  redeemers?: Redeemers;
  certificates?: ICertificate[];
  metadata?: IMetadata[];
  size: number;
}
