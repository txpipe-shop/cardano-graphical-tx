import {
  type Block as BaseBlock,
  type Tx as BaseTx,
  type UTxO as BaseUTxO,
  HexString
} from '../utxo-model';

export * from './utils';

export enum RdmrPurpose {
  Spend = 'spend',
  Mint = 'mint',
  Cert = 'cert',
  Reward = 'reward',
  Vote = 'vote',
  Purpose = 'purpose',
  Unspecified = 'unspecified'
}

export type Redeemer = {
  index: number;
  purpose: RdmrPurpose;
  scriptHash: HexString;
  redeemerDataHash: HexString;
  unitMem: bigint;
  unitSteps: bigint;
  fee: bigint;
};

export enum ScriptType {
  Native = 'native',
  PlutusV1 = 'plutusV1',
  PlutusV2 = 'plutusV2',
  PlutusV3 = 'plutusV3'
}

export type Script = {
  type?: ScriptType;
  bytes?: HexString;
  hash?: HexString;
};

/**
 * Cardano specific transaction properties
 */
export type CardanoTxFields = {
  treasuryDonation?: bigint;
  createdAt?: number;
  witnesses?: { redeemers?: Redeemer[]; scripts?: Script[] };
  validityInterval?: { invalidBefore?: bigint; invalidHereafter?: bigint };
  indexInBlock: bigint;
};

export type CardanoBlockFields = { epochNo: bigint };

export type UTxO = BaseUTxO & { referenceScript?: Script };
export type Tx = BaseTx<UTxO> & CardanoTxFields;
export type Block = BaseBlock<UTxO, Tx> & CardanoBlockFields;
