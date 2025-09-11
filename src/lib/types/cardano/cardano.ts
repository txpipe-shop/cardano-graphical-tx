import {
  type Block as BaseBlock,
  type Tx as BaseTx,
  type UTxO as BaseUTxO,
  HexString
} from '../utxo-model';

/**
 * Cardano specific transaction properties
 */
export type CardanoTxFields = {
  treasury?: bigint;
  treasuryDonation?: bigint;
  createdAt?: number;
};

export type UTxO = BaseUTxO & { referenceScript?: HexString };
export type Tx = BaseTx<UTxO> & CardanoTxFields;

export type Block = BaseBlock<UTxO, Tx>;
