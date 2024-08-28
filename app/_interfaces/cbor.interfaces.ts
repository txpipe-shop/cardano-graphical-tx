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

export interface ICborUtxo {
  txHash: string;
  index: number;
  address: string;
  assets: ICborAsset[];
  datum?: ICborDatum;
}

export interface ICborTransaction {
  txHash: string;
  fee: number;
  inputs: ICborInput[];
  referenceInputs: ICborInput[];
  outputs: ICborUtxo[];
  mints: ICborAsset[];
  scriptsSuccessful: boolean;
}
