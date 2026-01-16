import type {
  Assets,
  Certificates,
  Collateral,
  Metadata,
  Utxo,
  Withdrawal,
  Witnesses,
} from "@laceanatomy/napi-pallas";

export interface ITransaction {
  era: string;
  txHash: string;
  fee: number;
  scriptsSuccessful: boolean;
  inputs: Utxo[];
  referenceInputs: Utxo[];
  outputs: Utxo[];
  mints: Assets[];
  blockHash?: string;
  blockTxIndex?: number;
  blockHeight?: number;
  blockAbsoluteSlot?: number;
  validityStart?: number;
  ttl?: number;
  metadata?: Metadata[];
  withdrawals?: Withdrawal[];
  certificates?: Certificates[];
  collateral?: Collateral;
  witnesses?: Witnesses;
  size: number;
}
