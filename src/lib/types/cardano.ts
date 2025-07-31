import { type Tx as BaseTx, type Block as BaseBlock } from './utxo-model';

/**
 * Cardano specific transaction properties
 */
export type CardanoTxFields = {
  treasury: bigint;
  treasuryDonation?: bigint;
};

export type Tx = BaseTx & CardanoTxFields;

export type Block = BaseBlock;
