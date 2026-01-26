import { Pool } from 'pg';
import { TransactionsResponse } from '../types';
import { DbSyncProvider } from '@laceanatomy/cardano-provider-dbsync';
import { mapTx } from './common';
import { Hash } from '@laceanatomy/types';
import { Transaction } from '../types';

export async function listTransactions(
  limit: bigint,
  offset: bigint,
  pool: Pool,
  magic: number,
  nodeUrl: string,
  addressPrefix: string
): Promise<TransactionsResponse> {
  const provider = new DbSyncProvider({
    pool,
    addrPrefix: addressPrefix,
    magic: magic,
    nodeUrl: nodeUrl
  });

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

export async function resolveTx(
  hash: Hash,
  pool: Pool,
  magic: number,
  nodeUrl: string,
  addressPrefix: string
): Promise<Transaction> {
  const provider = new DbSyncProvider({
    pool,
    addrPrefix: addressPrefix,
    magic: magic,
    nodeUrl: nodeUrl
  });
  const tx = await provider.getTx({ hash });
  return mapTx(tx);
}
