import type Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import type { ICborAsset, ICborDatum } from ".";

export interface TransactionsBox {
  transactions: Transaction[];
  utxos: UtxoObject;
}

export interface Transaction {
  txHash: string;
  pos: Vector2d;
  outputsUTXO: UtxoItem[];
  inputsUTXO: UtxoItem[];
  producedLines: (Konva.Line | null)[];
  consumedLines: (Konva.Line | null)[];
  blockHash?: string;
  blockTxIndex?: number;
  blockHeight: number;
  blockAbsoluteSlot?: number;
  mint: ICborAsset[];
  invalidBefore?: number;
  invalidHereafter?: number;
  fee: number;
  withdrawals?: any[];
  scriptsSuccessful?: boolean;
  redeemers?: Redeemers;
  metadata?: any;
  size?: number;
  alias: string;
}

export interface UtxoObject {
  // utxoHash format: `${txHash}#${index}`
  [utxoHash: string]: UtxoItem;
}

export interface UtxoItem {
  utxoHash: string;
  index: number;
  assets: Array<ICborAsset>;
  address?: Address;
  datum: ICborDatum | undefined;
  pos: Vector2d;
  lines: (Konva.Line | null)[];
  distance: Vector2d;
  isReferenceInput: boolean;
  redeemers?: RedeemerSpend;
}

export interface Address {
  bech32: string;
  headerType: string;
  netType: string;
  payment: string;
  kind: "key" | "script";
}

export interface UtxoAsPoint {
  utxo: UtxoObject;
  start: Vector2d;
  end: Vector2d;
}

export interface UtxoList {
  inputs: Array<UtxoAsPoint>;
  outputs: Array<UtxoAsPoint>;
}

export interface Redeemers {
  spends: RedeemerSpend[];
  mints: any[];
  withdrawals: any[];
}

interface RedeemerSpend {
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
