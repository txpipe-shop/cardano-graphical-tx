import { TransactionsResponse, Transaction } from '../types';
import { mapTx } from './common';
import { Hash } from '@laceanatomy/types';
import { createProvider, NetworkConfig } from '../utils';

export async function listTransactions(
  limit: bigint,
  offset: bigint,
  config: NetworkConfig
): Promise<TransactionsResponse> {
  const provider = createProvider(config);

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

export async function resolveTx(hash: Hash, config: NetworkConfig): Promise<Transaction> {
  const provider = createProvider(config);
  const tx = await provider.getTx({ hash });
  return mapTx(tx);
}
