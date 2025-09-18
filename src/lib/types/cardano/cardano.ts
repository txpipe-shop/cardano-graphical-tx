import {
  type Block as BaseBlock,
  type Tx as BaseTx,
  type UTxO as BaseUTxO,
  HexString
} from '../utxo-model';

export type Redeemer = {
  index: number;
  purpose: 'spend' | 'mint' | 'cert' | 'reward';
  scriptHash: HexString;
  redeemerDataHash: HexString;
  unitMem: bigint;
  unitSteps: bigint;
  fee: bigint;
};

/**
 * Cardano specific transaction properties
 */
export type CardanoTxFields = {
  treasury?: bigint;
  treasuryDonation?: bigint;
  createdAt?: number;
  redeemers?: Redeemer[];
};

export type UTxO = BaseUTxO & { referenceScript?: HexString };
export type Tx = BaseTx<UTxO> & CardanoTxFields;

export type Block = BaseBlock<UTxO, Tx>;
