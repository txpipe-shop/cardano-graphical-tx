import { Pool } from 'pg';
import { EpochsResponse, Epoch as EpochApi } from '../types';
import { DbSyncProvider } from '@laceanatomy/cardano-provider-dbsync';
import { Epoch } from '@laceanatomy/provider-core';

function mapEpoch(epoch: Epoch): EpochsResponse['epochs'][number] {
  const endTime = new Date(epoch.endTime * 1000);
  const startTime = new Date(epoch.startTime * 1000);

  return {
    start_slot: Number(epoch.startSlot),
    end_slot: Number(epoch.endSlot),
    epoch: Number(epoch.index),
    block_count: Number(epoch.blocksProduced),
    // TODO: not really sure why two of them?
    blocks: Number(epoch.blocksProduced),
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    fees: epoch.fees.toString(),
    is_current: Date.now() < endTime.getTime() && startTime.getTime() < Date.now(),
    // TODO: why two of them?
    transaction_count: Number(epoch.txCount),
    transactions: Number(epoch.txCount)
  };
}

export async function listEpochs(
  limit: bigint,
  offset: bigint,
  pool: Pool
): Promise<EpochsResponse> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
  const epochs = await provider.getEpochs({ limit, offset, query: undefined });

  return {
    epochs: epochs.data.map(mapEpoch),
    pagination: {
      offset: Number(offset),
      total: Number(epochs.total),
      limit: Number(limit),
      hasMore: limit + offset < epochs.total
    }
  };
}

export async function resolveEpoch(epochNo: bigint, pool: Pool): Promise<EpochApi> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });

  const epoch = await provider.getEpoch({ epochNo });

  return {
    end_height: Number(epoch.endHeight),
    end_slot: Number(epoch.endSlot),
    end_time: new Date(epoch.endTime * 1000).toISOString(),
    epoch: Number(epoch.index),
    start_height: Number(epoch.startHeight),
    start_slot: Number(epoch.startSlot),
    start_time: new Date(epoch.startTime * 1000).toISOString(),
    // TODO: What does this mean?
    actual_end_slot: Number(epoch.endSlot),
    // TODO: What does this mean?
    actual_start_slot: Number(epoch.startSlot),
    block_count: Number(epoch.blocksProduced),
    // TODO: What does this mean?
    blocks: Number(epoch.blocksProduced),
    // TODO: Use blocks endpoint
    blocks_list: [],
    // TODO: fetch this
    current_epoch: 0,
    fees: Number(epoch.fees).toString(),
    is_current: Date.now() <= epoch.endTime && epoch.startHeight <= Date.now(),
    transaction_count: Number(epoch.txCount),
    transactions: Number(epoch.txCount)
  };
}
