/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export interface ShelleyPart {
  isScript: boolean;
  hash?: string;
  pointer?: string;
}
export interface AddressDiagnostic {
  kind: string;
  network?: string;
  paymentPart?: ShelleyPart;
  delegationPart?: ShelleyPart;
  byronCbor?: string;
}
export interface Output {
  error?: string;
  bytes?: string;
  address?: AddressDiagnostic;
}
export interface Datum {
  hash: string;
  bytes: string;
  json: string;
}
export interface Asset {
  assetName: string;
  assetNameAscii?: string;
  amount?: number;
}
export interface Assets {
  policyId: string;
  assetsPolicy: Array<Asset>;
}
export interface Utxo {
  txHash: string;
  index: number;
  bytes: string;
  address: string;
  lovelace: number;
  datum?: Datum;
  assets: Array<Assets>;
  scriptRef?: string;
}
export interface Input {
  txHash: string;
  index: number;
}
export interface Metadata {
  label: string;
  jsonMetadata: Record<string, string>;
}
export interface Withdrawal {
  rawAddress: string;
  amount: number;
}
export interface Certificates {
  json: string;
}
export interface Collateral {
  total?: number;
  collateralReturn: Array<Input>;
}
export interface Witness {
  key: string;
  hash: string;
  signature: string;
}
export interface ExUnits {
  mem: number;
  steps: number;
}
export interface Redeemer {
  tag: string;
  index: number;
  dataJson: string;
  exUnits: ExUnits;
}
export interface Witnesses {
  vkeyWitnesses: Array<Witness>;
  redeemers: Array<Redeemer>;
  plutusData: Array<Datum>;
  plutusV1Scripts: Array<string>;
  plutusV2Scripts: Array<string>;
  plutusV3Scripts: Array<string>;
}
export interface CborResponse {
  era: string;
  txHash: string;
  scriptsSuccessful: boolean;
  fee?: number;
  inputs: Array<Input>;
  referenceInputs: Array<Input>;
  outputs: Array<Utxo>;
  mints: Array<Assets>;
  validityStart?: number;
  ttl?: number;
  metadata: Array<Metadata>;
  withdrawals: Array<Withdrawal>;
  certificates: Array<Certificates>;
  collateral: Collateral;
  witnesses: Witnesses;
  size: number;
  error: string;
}
export declare function cborParse(raw: string): CborResponse;
export declare function napiParseDatumInfo(raw: string): Datum | null;
