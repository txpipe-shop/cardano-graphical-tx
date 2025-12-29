import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';

// READ FROM ENV
const connectionString = process.env.DB_CONNECTION_STRING;

describe('DbSyncProvider', () => {
  let pool: Pool;
  let provider: DbSyncProvider;

  beforeAll(() => {
    if (!connectionString) {
      console.warn('Skipping tests: DB_CONNECTION_STRING not set');
      return;
    }
    pool = new Pool({ connectionString });
    provider = new DbSyncProvider({ pool });
  });

  afterAll(async () => {
    if (provider) {
      await provider.close();
    }
  });

  it('should fetch latest transaction', async () => {
    if (!connectionString) return;

    const tx = await provider.getLatestTx();
    expect(tx).toBeDefined();
    expect(tx.hash).toBeDefined();
    expect(typeof tx.fee).toBe('bigint');
    expect(tx.inputs.length).toBeGreaterThan(0);
    expect(tx.outputs.length).toBeGreaterThan(0);

    console.log('Latest Tx Hash:', tx.hash);
  });

  it('should fetch paginated transactions', async () => {
    if (!connectionString) return;

    const page1 = await provider.getTxs({ limit: 5 });
    expect(page1.data.length).toBeLessThanOrEqual(5);
    expect(page1.data.length).toBeGreaterThan(0);
    expect(page1.total).toBeGreaterThan(0n);
    expect(page1.nextCursor).toBeDefined();

    const cursor = page1.nextCursor;

    if (cursor) {
      const page2 = await provider.getTxs({ limit: 5, before: cursor });
      expect(page2.data.length).toBeLessThanOrEqual(5);
      if (page2.data.length > 0) {
        expect(page2.data[0].hash).not.toBe(page1.data[0].hash);
      }
    }
  });
});
