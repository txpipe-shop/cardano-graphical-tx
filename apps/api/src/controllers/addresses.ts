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
import { TokenRegistryClient } from '@laceanatomy/cardano-token-registry-sdk';

export async function resolveAddress(
  rawAddress: string,
  config: NetworkConfig
): Promise<AddressSchema> {
  const provider = createProvider(config);
  const tokenClient = new TokenRegistryClient(config.tokenRegistryUrl);
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

  const assetUnits = Object.keys(funds.value).filter((u) => u !== 'lovelace');
  const metadataMap = await tokenClient.getTokens(assetUnits);

  const tokens: AddressSchema['tokens'] = Object.entries(funds.value)
    .filter(([u]) => u !== 'lovelace')
    .map(([u, amount]) => {
      const unit = u as Unit;
      const metadata = metadataMap.get(unit);

      const decimals = metadata?.decimals ?? 0;
      const amountVal = Number(amount);
      const balanceFormatted =
        decimals > 0 ? (amountVal / 10 ** decimals).toFixed(decimals) : amountVal.toString();

      return {
        asset_name: assetNameFromUnit(unit),
        asset_name_hex: assetNameFromUnit(unit),
        policy_id: policyFromUnit(unit),
        balance_formatted: balanceFormatted,
        decimals: decimals,
        fingerprint: fingerprintFromUnit(unit),
        balance: amount.toString(),
        quantity: amount.toString(),
        name: metadata?.name ?? metadata?.ticker ?? null,
        symbol: metadata?.ticker ?? undefined,
        token_name: metadata?.name ?? undefined,
        token_symbol: metadata?.ticker ?? undefined,
        // EVM fields
        token_address: undefined,
        value: undefined
      };
    });

  return {
    address,
    balance_lovelace: balanceLovelace,
    tx_count: Number(funds.txCount),
    balance_ada: balanceAda,
    address_bech32: isBase58(address)
      ? null
      : hexToBech32(HexString(address), config.addressPrefix),
    unspent_utxo_count: Number(totalUtxos),
    tokens,
    first_seen_height: funds.firstSeen ? Number(funds.firstSeen.blockHeight) : undefined,
    first_seen_slot: funds.firstSeen ? Number(funds.firstSeen.slot) : undefined,
    last_seen_height: funds.lastSeen ? Number(funds.lastSeen.blockHeight) : undefined,
    last_seen_slot: funds.lastSeen ? Number(funds.lastSeen.slot) : undefined,
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
  const addressHex = Buffer.from(rawAddress, 'hex').toString('hex');

  const { data: txs, total: totalTxs } = await provider.getTxs({
    limit,
    offset,
    query: { address: Address(rawAddress) }
  });

  const transactions: AddressTransaction[] = txs.map((tx) => {
    let received = 0n;
    let sent = 0n;

    for (const out of tx.outputs) {
      if (out.address === rawAddress || out.address === addressHex) {
        received += out.coin;
      }
    }

    for (const inp of tx.inputs) {
      if (inp.address === rawAddress || inp.address === addressHex) {
        sent += inp.coin;
      }
    }

    let type: 'sent' | 'received' | 'both' = 'both';
    if (sent > 0n && received === 0n) type = 'sent';
    else if (received > 0n && sent === 0n) type = 'received';

    return {
      amount_ada: Number(received - sent) / 10 ** 6,
      amount_lovelace: Number(received - sent),
      block_height: Number(tx.block?.height),
      hash: tx.hash,
      received_ada: Number(received) / 10 ** 6,
      sent_ada: Number(sent) / 10 ** 6,
      slot: Number(tx.block?.slot),
      timestamp: tx.createdAt ? new Date(tx.createdAt * 1000).toISOString() : null,
      tx_index: Number(tx.indexInBlock),
      type
    };
  });

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
