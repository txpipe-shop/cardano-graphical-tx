import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import { CardanoTransactionsApi, Configuration } from '@laceanatomy/blockfrost-sdk';
import { toEqualBfTx } from './matchers/toEqualBfTx';
import { Hash } from '@laceanatomy/types';
import { testEnv, TestEnv } from './setup';

expect.extend({ toEqualBfTx });

describe('DbSyncProvider Filters', () => {
  let pool: Pool;
  let provider: DbSyncProvider;
  let bfTxClient: CardanoTransactionsApi;
  let config: TestEnv;

  beforeAll(() => {
    config = testEnv.parse(process.env);
    pool = new Pool({ connectionString: config.DB_CONNECTION_STRING });
    provider = new DbSyncProvider({ pool });
    bfTxClient = new CardanoTransactionsApi(new Configuration({ basePath: config.BF_URL }));
  });

  afterAll(async () => {
    if (provider) {
      await provider.close();
    }
  });

  describe('getTxs (block filters)', () => {
    it('should filter transactions by block hash', async () => {
      const latest = await provider.getLatestTx();
      const blockHash = latest.block!.hash;
      const filtered = await provider.getTxs({
        limit: 10,
        query: {
          block: { hash: Hash(blockHash) }
        }
      });

      expect(filtered.data.length).toBeGreaterThan(0);
      expect(filtered.total).toBeGreaterThan(0n);

      for (const tx of filtered.data) {
        expect(tx.block!.hash).toBe(blockHash);
      }
    });

    it('should filter transactions by block height', async () => {
      const latest = await provider.getLatestTx();
      const blockHeight = BigInt(latest.block!.height);

      const filtered = await provider.getTxs({
        limit: 10,
        query: {
          block: { height: blockHeight }
        }
      });

      expect(filtered.data.length).toBeGreaterThan(0);
      expect(filtered.total).toBeGreaterThan(0n);

      for (const tx of filtered.data) {
        expect(BigInt(tx.block!.height)).toBe(blockHeight);
      }
    });

    it('should filter transactions by block slot', async () => {
      const slot = 1814800n;

      const filtered = await provider.getTxs({
        limit: 10,
        query: {
          block: { slot }
        }
      });

      expect(filtered.data.length).toBeGreaterThan(0);
    });
  });
});
