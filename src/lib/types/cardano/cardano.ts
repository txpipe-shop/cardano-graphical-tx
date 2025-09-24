import {
  type Block as BaseBlock,
  type Tx as BaseTx,
  type UTxO as BaseUTxO,
  HexString
} from '../utxo-model';

export const RdmrPurpose = {
  Spend: 'spend',
  Mint: 'mint',
  Cert: 'cert',
  Reward: 'reward',
  Vote: 'vote',
  Purpose: 'purpose',
  Unspecified: 'unspecified'
} as const;

export type RdmrPurpose = (typeof RdmrPurpose)[keyof typeof RdmrPurpose];

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
  bytes: HexString;
};

/**
 * Cardano specific transaction properties
 */
export type CardanoTxFields = {
  treasury?: bigint;
  treasuryDonation?: bigint;
  createdAt?: number;
  witnesses?: { redeemers?: Redeemer[]; scripts?: Script[] };
};

export type UTxO = BaseUTxO & { referenceScript?: Script };
export type Tx = BaseTx<UTxO> & CardanoTxFields;

export type Block = BaseBlock<UTxO, Tx>;
