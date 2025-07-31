import { type Tx as BaseTx } from './utxo-model';

/**
 * Cardano specific transaction properties
 */
export type CardanoSpecificTx = {
  treasury: bigint;
  treasuryDonation?: bigint;
};

export type CardanoTx = BaseTx & CardanoSpecificTx;
