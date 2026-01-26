import { BlocksResponse, Block as BlockSchema, BlockTxsResponse } from '../types';
import TimeAgo from 'javascript-time-ago';
import { Hash } from '@laceanatomy/types';
import { BlockMetadata } from '@laceanatomy/provider-core';
import { mapTx } from './common';
import { createProvider, NetworkConfig } from '../utils';

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
    epoch: block.epoch !== undefined ? Number(block.epoch) : null,
    size: block.size !== undefined ? Number(block.size) : null,
    // EVM fields
    base_fee_per_gas: undefined,
    gas_limit: undefined,
    gas_used: undefined
  };
}

export async function listBlocks(
  limit: bigint,
  offset: bigint,
  config: NetworkConfig,
  timeAgo: TimeAgo,
  epochNo?: bigint
): Promise<BlocksResponse> {
  const provider = createProvider(config);

  const { data: blocks, total } = await provider.getBlocks({
    limit: BigInt(limit),
    offset: BigInt(offset),
    query: epochNo !== undefined ? { epoch: epochNo } : undefined
  });

  const blocksRes: BlocksResponse['blocks'] = blocks.map((block: BlockMetadata) =>
    mapBlock(block, timeAgo)
  );

  return {
    blocks: blocksRes,
    pagination: {
      total: Number(total),
      limit: Number(limit),
      offset: Number(offset),
      hasMore: BigInt(offset + limit) < total
    }
  };
}

export async function resolveBlock(
  id: string | number,
  config: NetworkConfig,
  timeAgo: TimeAgo
): Promise<BlockSchema> {
  const provider = createProvider(config);

  const query = typeof id === 'string' ? { hash: Hash(id) } : { height: BigInt(id) };
  const block = await provider.getBlock(query);
  return mapBlock(block, timeAgo);
}

export async function resolveBlockTxs(
  id: string | number,
  limit: bigint,
  offset: bigint,
  config: NetworkConfig
): Promise<BlockTxsResponse> {
  const provider = createProvider(config);

  const query = typeof id === 'string' ? { hash: Hash(id) } : { height: BigInt(id) };

  const block = await provider.getBlock(query);

  const txs = await provider.getTxs({ query: { block: query }, limit, offset });

  const transactions = txs.data.map((tx) => mapTx(tx, block));

  return {
    transactions,
    pagination: {
      total: Number(txs.total),
      limit: Number(limit),
      offset: Number(offset),
      hasMore: limit + offset < txs.total
    }
  };
}
