import {
  type UTxO as BaseUTxO,
  type Tx as BaseTx,
  type Block as BaseBlock,
  HexString
} from '../utxo-model';

/**
 * Cardano specific transaction properties
 */
export type CardanoTxFields = {
  treasury?: bigint;
  treasuryDonation?: bigint;
  /** seconds since epoch */
  createdAt?: number;
};

export type UTxO = BaseUTxO & { referenceScript?: HexString };
export type Tx = BaseTx<UTxO> & CardanoTxFields;

export type Block = BaseBlock<UTxO, Tx>;
