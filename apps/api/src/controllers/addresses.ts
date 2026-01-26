import type {
  Address as AddressSchema,
  AddressTransaction,
  AddressTransactionsResponse,
  AddressUtxo,
  AddressUtxosResponse
} from '../types';
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
import { createProvider, NetworkConfig } from '../utils';

export async function resolveAddress(
  rawAddress: string,
  config: NetworkConfig
): Promise<AddressSchema> {
  const provider = createProvider(config);
  const address = Address(rawAddress);

  const funds = await provider.getAddressFunds({ address });

  const balanceLovelace = Number(funds.value[Unit('lovelace')]?.toString() || 0);
  const balanceAda = balanceLovelace / 10 ** 6;

  // TODO: improve it
  // Get counts only for summary
  const { total: totalTxs } = await provider.getTxs({
    limit: 1n,
    query: { address: Address(rawAddress) }
  });

  const { total: totalUtxos } = await provider.getAddressUTxOs({
    query: { address },
    limit: 1n
  });

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
    address_bech32: isBase58(address)
      ? null
      : hexToBech32(HexString(address), config.addressPrefix),
    unspent_utxo_count: Number(totalUtxos),
    tokens,
    first_seen_height: undefined,
    first_seen_slot: undefined,
    last_seen_height: undefined,
    last_seen_slot: undefined,
    total_utxo_count: undefined
  };
}

export async function listAddressTransactions(
  rawAddress: string,
  limit: bigint,
  offset: bigint,
  config: NetworkConfig
): Promise<AddressTransactionsResponse> {
  const provider = createProvider(config);

  const { data: txs, total: totalTxs } = await provider.getTxs({
    limit,
    offset,
    query: { address: Address(rawAddress) }
  });

  const transactions: AddressTransaction[] = txs.map((tx) => ({
    amount_ada: 123,
    amount_lovelace: 123,
    block_height: Number(tx.block?.height),
    hash: tx.hash,
    received_ada: 123,
    sent_ada: 123,
    slot: 0,
    timestamp: tx.createdAt ? new Date(tx.createdAt).toISOString() : null,
    tx_index: Number(tx.indexInBlock),
    type: 'both' as const
  }));

  return {
    transactions,
    pagination: {
      total: Number(totalTxs),
      limit: Number(limit),
      offset: Number(offset),
      hasMore: limit + offset < totalTxs
    }
  };
}

export async function listAddressUtxos(
  rawAddress: string,
  limit: bigint,
  offset: bigint,
  config: NetworkConfig
): Promise<AddressUtxosResponse> {
  const provider = createProvider(config);
  const address = Address(rawAddress);

  const { data: outputs, total: totalUtxos } = await provider.getAddressUTxOs({
    query: { address },
    limit,
    offset
  });

  const utxos: AddressUtxo[] = outputs.map((x) => ({
    amount_ada: Number(x.coin) / 10 ** 6,
    amount_lovelace: Number(x.coin),
    output_index: Number(x.outRef.index),
    tx_hash: x.outRef.hash,
    utxo_id: `${x.outRef.hash}#${x.outRef.index}`,
    block_height: 0,
    slot: 0
  }));

  return {
    utxos,
    pagination: {
      total: Number(totalUtxos),
      limit: Number(limit),
      offset: Number(offset),
      hasMore: limit + offset < totalUtxos
    }
  };
}
