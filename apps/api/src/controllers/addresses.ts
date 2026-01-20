import { Pool } from 'pg';
import type { Address as AddressSchema, TransactionsResponse, UTxOsResponse } from '../types';
import {
  Address,
  assetNameFromUnit,
  fingerprintFromUnit,
  HexString,
  hexToBech32,
  isBase58,
  policyFromUnit,
  Unit
} from '@laceanatomy/types';
import { DbSyncProvider } from '@laceanatomy/cardano-provider-dbsync';
import { mapTx } from './common';

export async function resolveAddress(rawAddress: string, pool: Pool): Promise<AddressSchema> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
  const address = Address(rawAddress);

  const funds = await provider.getAddressFunds({ address });

  const balanceLovelace = Number(funds.value[Unit('lovelace')]?.toString() || 0);
  const balanceAda = balanceLovelace / 10 ** 6;

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
    // TODO: implement count method
    tx_count: Number(0),
    balance_ada: balanceAda,
    address_bech32: isBase58(address) ? null : hexToBech32(HexString(address), 'addr'),
    // TODO: implement count method
    unspent_utxo_count: Number(0),
    tokens,
    // TODO: fields are not being used in UI
    first_seen_height: undefined,
    first_seen_slot: undefined,
    last_seen_height: undefined,
    last_seen_slot: undefined,
    total_utxo_count: undefined
  };
}

export async function resolveAddressTxs(
  rawAddress: string,
  offset: bigint,
  limit: bigint,
  pool: Pool
): Promise<TransactionsResponse> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
  const address = Address(rawAddress);

  const txs = await provider.getTxs({ limit, offset, query: { address } });
  const transactions = txs.data.map((tx) => mapTx(tx));

  return {
    transactions: transactions,
    pagination: {
      offset: Number(offset),
      total: Number(txs.total),
      limit: Number(limit),
      hasMore: limit + offset < txs.total
    }
  };
}

export async function resolveAddressUTxOs(
  rawAddress: string,
  offset: bigint,
  limit: bigint,
  pool: Pool
): Promise<UTxOsResponse> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
  const address = Address(rawAddress);

  const outputs = await provider.getAddressUTxOs({
    limit,
    offset,
    query: { address }
  });

  const utxos = outputs.data.map((x) => ({
    amount_ada: Number(x.coin) / 10 ** 6,
    amount_lovelace: Number(x.coin),
    output_index: Number(x.outRef.index),
    tx_hash: x.outRef.hash,
    utxo_id: `${x.outRef.hash}#${x.outRef.index}`,
    // TOOD: information not used by UI
    block_height: 0,
    slot: 0
  }));

  return {
    utxos,
    pagination: {
      offset: Number(offset),
      total: Number(outputs.total),
      limit: Number(limit),
      hasMore: limit + offset < outputs.total
    }
  };
}
