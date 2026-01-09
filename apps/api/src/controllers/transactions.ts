import { Pool } from 'pg';
import { TransactionsResponse } from '../types';
import { DbSyncProvider } from '@laceanatomy/cardano-provider-dbsync';
import { mapTx } from './common';
import { Hash } from '@laceanatomy/types';
import { Transaction } from '../types';

export async function listTransactions(
  limit: bigint,
  offset: bigint,
  pool: Pool
): Promise<TransactionsResponse> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });

  const txs = await provider.getTxs({ limit, offset, query: undefined });
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

export async function resolveTx(hash: Hash, pool: Pool): Promise<Transaction> {
  const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
  const tx = await provider.getTx({ hash });
  return mapTx(tx);
}
