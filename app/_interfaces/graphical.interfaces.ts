import type Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import type { ICborAsset, ICborDatum, Redeemers, RedeemerSpend } from ".";

export interface TransactionsBox {
  transactions: IGraphicalTransaction[];
  utxos: UtxoObject;
}

export interface UtxoObject {
  // utxoHash format: `${txHash}#${index}`
  [utxoHash: string]: IGraphicalUtxo;
}

export interface IGraphicalTransaction {
  txHash: string;
  pos: Vector2d;
  outputsUTXO: IGraphicalUtxo[];
  inputsUTXO: IGraphicalUtxo[];
  producedLines: (Konva.Line | null)[];
  consumedLines: (Konva.Line | null)[];
  blockHash?: string;
  blockTxIndex?: number;
  blockHeight?: number;
  blockAbsoluteSlot?: number;
  mint: ICborAsset[];
  invalidBefore?: number;
  invalidHereafter?: number;
  fee: number;
  withdrawals?: any[];
  scriptsSuccessful: boolean;
  redeemers?: Redeemers;
  metadata?: any;
  size?: number;
  alias: string;
}

export interface IGraphicalUtxo {
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
