import { createProvider, NetworkConfig } from '../utils';

export async function listPools(
  limit: number,
  offset: number,
  search: string | undefined,
  config: NetworkConfig
) {
  const provider = createProvider(config);

  if (!provider.getPools) {
    return {
      pools: [],
      pagination: {
        total: 0,
        limit,
        offset,
        hasMore: false
      },
      totals: {
        total_pools: 0,
        total_stake: '0',
        total_delegators: 0
      }
    };
  }

  const { data, total, totals } = await provider.getPools({
    limit: BigInt(limit),
    offset: BigInt(offset),
    query: { search }
  });

  return {
    pools: data,
    pagination: {
      total: Number(total),
      limit,
      offset,
      hasMore: Number(total) > offset + limit
    },
    totals: totals ?? {
      total_pools: 0,
      total_stake: '0',
      total_delegators: 0
    }
  };
}

export async function getPool(id: string, config: NetworkConfig) {
  const provider = createProvider(config);

  if (!provider.getPool) {
    throw new Error('Provider does not support pool operations');
  }

  const pool = await provider.getPool({ id });

  return {
    pool
  };
}
