import type { cardano } from '@alexandria/types';
import { Address, Hash } from '@alexandria/types';
import type * as QueryTypes from './types/queries';

/**
 * Map a transaction row from db-sync to CardanoTx format.
 */
export function mapTxRow(row: QueryTypes.Tx): cardano.Tx {
  return {
    hash: Hash(''),
    inputs: [],
    outputs: [],
    mint: {},
    metadata: undefined,
    fee: BigInt(row.fees),
    referenceInputs: [],
    block: undefined,
    treasuryDonation: undefined,
    createdAt: undefined,
    treasury: undefined,
    validityInterval: undefined,
    witnesses: undefined
  };
}

/**
 * Map transaction row with UTxOs from db-sync to CardanoTx format.
 */
export function mapTxUtxosRow(txRow: QueryTypes.Tx, utxoRows: QueryTypes.TxUtxo[]): cardano.Tx {
  const inputs: cardano.UTxO[] = utxoRows
    .filter((u) => u.type === 'input')
    .map((u) => mapUtxoRow(u));

  const outputs: cardano.UTxO[] = utxoRows
    .filter((u) => u.type === 'output')
    .map((u) => mapUtxoRow(u));

  return {
    ...mapTxRow(txRow),
    inputs,
    outputs
  };
}

/**
 * Map a UTxO row from db-sync to CardanoUTxO format.
 */
export function mapUtxoRow(row: QueryTypes.TxUtxo): cardano.UTxO {
  return {
    coin: 123n,
    outRef: {
      hash: Hash(row.tx_hash),
      index: BigInt(row.output_index)
    },
    address: Address(row.address),
    value: {},
    datum: undefined
  };
}
