import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import { testEnv, TestEnv } from './setup';
import { Unit } from '@laceanatomy/types';

describe('DbSyncProvider - Address Summary', () => {
  let pool: Pool;
  let provider: DbSyncProvider;
  let config: TestEnv;

  beforeAll(() => {
    config = testEnv.parse(process.env);
    pool = new Pool({ connectionString: config.DB_CONNECTION_STRING });
    provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
  });

  afterAll(async () => {
    if (provider) {
      await provider.close();
    }
  });

  it('should return firstSeen and lastSeen stats for an active address', async () => {
    const latestTx = await provider.getLatestTx();
    const addressWithUtxos = latestTx.outputs[0]?.address;

    if (!addressWithUtxos) {
      throw new Error('No address found in latest transaction');
    }

    const funds = await provider.getAddressFunds({ address: addressWithUtxos });

    expect(funds).toBeDefined();
    expect(funds.firstSeen).toBeDefined();
    expect(funds.lastSeen).toBeDefined();

    if (funds.firstSeen) {
      expect(typeof funds.firstSeen.blockHeight).toBe('bigint');
      expect(typeof funds.firstSeen.slot).toBe('bigint');
      expect(typeof funds.firstSeen.hash).toBe('string');
    }

    if (funds.lastSeen) {
      expect(typeof funds.lastSeen.blockHeight).toBe('bigint');
      expect(typeof funds.lastSeen.slot).toBe('bigint');
      expect(typeof funds.lastSeen.hash).toBe('string');
    }

    // Logic check: first seen block height should be <= last seen block height
    if (funds.firstSeen && funds.lastSeen) {
      expect(funds.firstSeen.blockHeight).toBeLessThanOrEqual(funds.lastSeen.blockHeight);
    }
  });
});
