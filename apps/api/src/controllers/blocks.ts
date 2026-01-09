import { Pool } from 'pg';
import { BlocksResponse, Block as BlockSchema, Transaction as TransactionSchema } from '../types';
import TimeAgo from 'javascript-time-ago';
import { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';
import {
  Address,
  assetNameFromUnit,
  cardano,
  fingerprintFromUnit,
  Hash,
  hexToBech32,
  isHexString,
  policyFromUnit,
  Unit
} from '@alexandria/types';
import { BlockMetadata } from '@alexandria/provider-core';

function mapBlock(block: BlockMetadata, timeAgo: TimeAgo): BlockSchema {
  const date = new Date(block.time * 1000);
  return {
    hash: block.hash,
    height: Number(block.height),
    slot: Number(block.slot),
    timestamp: date.toISOString(),
    time: timeAgo.format(date),
    tx_count: Number(block.txCount),
    confirmations: block.confirmations !== undefined ? Number(block.confirmations) : undefined,
    // TODO: add (not sure if it's in the UI)
    epoch: null,
    // TODO: add  (not sure if it's in the UI)
    size: null,
    // EVM fields
    base_fee_per_gas: undefined,
    gas_limit: undefined,
    gas_used: undefined
  };
}

function mapTx(b: BlockMetadata, tx: cardano.Tx): TransactionSchema {
  const toBech32 = (x: Address) => {
    if (isHexString(x)) {
      return hexToBech32(x, 'addr');
    } else {
      return null;
    }
  };

  const addressesIn = tx.inputs.map(({ address }) => address);
  const addressesInB32 = addressesIn.map(toBech32).filter((x): x is string => x !== null);

  const inputs: TransactionSchema['inputs'] = tx.inputs.map((x, i) => ({
    address: x.address,
    address_bech32: toBech32(x.address),
    amount_ada: Number(x.coin) / 10 ** 6,
    amount_lovelace: Number(x.coin),
    input_index: i,
    utxo_id: `${x.outRef.hash}#${x.outRef.index}`
  }));

  const outputs: TransactionSchema['outputs'] = tx.outputs.map((x) => {
    const tokens: NonNullable<TransactionSchema['outputs']>[number]['tokens'] = Object.entries(
      x.value
    ).map(([u, amount]) => {
      const unit = Unit(u);
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
      address: x.address,
      address_bech32: toBech32(x.address),
      amount_ada: Number(x.coin) / 10 ** 6,
      amount_lovelace: Number(x.coin),
      output_index: Number(x.outRef.index),
      tokens
    };
  });

  return {
    block_height: Number(tx.block.height),
    output_count: tx.outputs.length,
    hash: tx.hash,
    // TODO: what's the difference here
    status: 'confirmed',
    timestamp: tx.createdAt ? new Date(tx.createdAt * 1000).toISOString() : null,
    // TODO: what ada amount, inputs, outputs?
    ada_amount: 123,
    block_hash: tx.block.hash,
    block_slot: Number(tx.block.slot),
    confirmations: Number(b.confirmations),
    epoch: Number(tx.block.epochNo),
    error: null,
    fee: Number(tx.fee),
    fee_ada: Number(tx.fee) / 10 ** 6,
    from_addresses: addressesIn,
    from_addresses_bech32: addressesInB32,
    index: Number(tx.indexInBlock),
    input_count: tx.inputs.length,
    // TODO: what does this mean?
    is_valid: true,
    inputs,
    outputs
  };
}

export async function listBlocks(
  limit: bigint,
  offset: bigint,
  pool: Pool,
  timeAgo: TimeAgo
): Promise<BlocksResponse> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });

  const { data: blocks, total } = await provider.getBlocks({
    limit: BigInt(limit),
    offset: BigInt(offset),
    query: undefined
  });

  const blocksRes: BlocksResponse['blocks'] = blocks.map((block) => mapBlock(block, timeAgo));

  const res: BlocksResponse = {
    blocks: blocksRes,
    pagination: {
      total: Number(total),
      limit: Number(limit),
      offset: Number(offset),
      hasMore: BigInt(offset + limit) < total
    }
  };
  return res;
}

export async function resolveBlock(
  id: string | number,
  pool: Pool,
  timeAgo: TimeAgo
): Promise<BlockSchema> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });

  const query = typeof id === 'string' ? { hash: Hash(id) } : { height: BigInt(id) };
  const block = await provider.getBlock(query);
  return mapBlock(block, timeAgo);
}

export async function resolveBlockTxs(
  id: string | number,
  limit: bigint,
  offset: bigint,
  pool: Pool
): Promise<{ transactions: TransactionSchema[] }> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });

  const query = typeof id === 'string' ? { hash: Hash(id) } : { height: BigInt(id) };

  const block = await provider.getBlock(query);

  // TODO: add pagination here
  const txs = await provider.getTxs({ query: { block: query }, limit, offset });

  const transactions = txs.data.map((tx) => mapTx(block, tx));

  return { transactions };
}
