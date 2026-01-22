import { Pool } from 'pg';
import { BlocksResponse, Block as BlockSchema, Transaction as TransactionSchema } from '../types';
import TimeAgo from 'javascript-time-ago';
import { DbSyncProvider } from '@laceanatomy/cardano-provider-dbsync';
import { Hash } from '@laceanatomy/types';
import { BlockMetadata } from '@laceanatomy/provider-core';
import { mapTx } from './common';
import { env } from '../env';

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

export async function listBlocks(
  limit: bigint,
  offset: bigint,
  pool: Pool,
  timeAgo: TimeAgo
): Promise<BlocksResponse> {
  const provider = new DbSyncProvider({
    pool,
    addrPrefix: 'addr',
    magic: env.MAGIC,
    nodeUrl: env.NODE_URL
  });

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
  const provider = new DbSyncProvider({
    pool,
    addrPrefix: 'addr',
    magic: env.MAGIC,
    nodeUrl: env.NODE_URL
  });

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
  const provider = new DbSyncProvider({
    pool,
    addrPrefix: 'addr',
    magic: env.MAGIC,
    nodeUrl: env.NODE_URL
  });

  const query = typeof id === 'string' ? { hash: Hash(id) } : { height: BigInt(id) };

  const block = await provider.getBlock(query);

  // TODO: add pagination here
  const txs = await provider.getTxs({ query: { block: query }, limit, offset });

  const transactions = txs.data.map((tx) => mapTx(tx, block));

  return { transactions };
}
