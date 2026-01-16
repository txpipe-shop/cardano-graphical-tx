import { Pool } from 'pg';
import type { Address as AddressSchema } from '../types';
import {
  Address,
  assetNameFromUnit,
  fingerprintFromUnit,
  HexString,
  hexToBech32,
  isBase58,
  policyFromUnit,
  Unit
} from '@alexandria/types';
import { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';

export async function resolveAddress(rawAddress: string, pool: Pool): Promise<AddressSchema> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
  const address = Address(rawAddress);

  const funds = await provider.getAddressFunds({ address });

  const balanceLovelace = Number(funds.value[Unit('lovelace')]?.toString() || 0);
  const balanceAda = balanceLovelace / 10 ** 6;

  // TODO: API needs to have pagination over this (recommendation: do this with different endpoints)
  const { data: txs, total: totalTxs } = await provider.getTxs({
    limit: 100n,
    query: { address: Address(rawAddress) }
  });

  // TODO: API needs to have pagination over this (recommendation: do this with different endpoints)
  const { data: outputs, total: totalUtxos } = await provider.getAddressUTxOs({
    query: { address },
    limit: 100n
  });

  const transactions: AddressSchema['transactions'] = txs.map((tx) => {
    return {
      // TODO: What amount of ADA (in inputs or outputs?)
      amount_ada: 123,
      amount_lovelace: 123,
      block_height: Number(tx.block?.height),
      hash: tx.hash,
      // TODO: received ADA in which address?
      received_ada: 123,
      // TODO: sent ADA to which address?
      sent_ada: 123,

      // TODO: information not shown in UI
      slot: 0,
      timestamp: tx.createdAt ? new Date(tx.createdAt).toISOString() : null,
      tx_index: Number(tx.indexInBlock),
      // TODO: ask what type means for a tx
      type: 'both'
    };
  });

  const utxos: AddressSchema['utxos'] = outputs.map((x) => ({
    amount_ada: Number(x.coin) / 10 ** 6,
    amount_lovelace: Number(x.coin),
    output_index: Number(x.outRef.index),
    tx_hash: x.outRef.hash,
    utxo_id: `${x.outRef.hash}#${x.outRef.index}`,
    // TOOD: information not used by UI
    block_height: 0,
    slot: 0
  }));

  const tokens: AddressSchema['tokens'] = Object.entries(funds.value).map(([u, amount]) => {
    const unit = u as Unit;
    return {
      asset_name: assetNameFromUnit(unit),
      asset_name_hex: assetNameFromUnit(unit),
      policy_id: policyFromUnit(unit),
      // TODO: balance formatted into what
      balance_formatted: null,
      // TODO: get from token registry?
      decimals: null,
      fingerprint: fingerprintFromUnit(unit),
      // why multiple ways of specifying amounts?
      balance: amount.toString(),
      quantity: amount.toString(),
      // TODO: just utf8 of hex name or also support cip68?
      name: null,
      // EVM fields
      symbol: undefined,
      token_address: undefined,
      token_name: undefined,
      token_symbol: undefined,
      value: undefined
    };
  });

  return {
    address,
    balance_lovelace: balanceLovelace,
    tx_count: Number(totalTxs),
    balance_ada: balanceAda,
    address_bech32: isBase58(address) ? null : hexToBech32(HexString(address), 'addr'),
    unspent_utxo_count: Number(totalUtxos),
    tokens,
    transactions,
    utxos,
    // TODO: fields are not being used in UI
    first_seen_height: undefined,
    first_seen_slot: undefined,
    last_seen_height: undefined,
    last_seen_slot: undefined,
    total_utxo_count: undefined
  };
}
