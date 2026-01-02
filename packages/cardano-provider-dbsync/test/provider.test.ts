import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import { CardanoTransactionsApi, Configuration } from '@alexandria/blockfrost-sdk';
import { toEqualBfTx } from './matchers/toEqualBfTx';
import { Hash } from '@alexandria/types';
import { testEnv, TestEnv } from './setup';

expect.extend({ toEqualBfTx });

describe('DbSyncProvider', () => {
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

  it('should fetch latest transaction', async () => {
    const tx = await provider.getLatestTx();
    console.log('Latest tx: ', tx.hash);
    expect(tx).toBeDefined();
    expect(tx.hash).toBeDefined();
    expect(typeof tx.fee).toBe('bigint');
    expect(tx.inputs.length).toBeGreaterThan(0);
    expect(tx.outputs.length).toBeGreaterThan(0);

    const { data: txContent } = await bfTxClient.txsHashGet(tx.hash);
    const { data: txContentUtxo } = await bfTxClient.txsHashUtxosGet(tx.hash);

    expect(tx).toEqualBfTx({ tx: txContent, utxos: txContentUtxo });
  });

  it('should fetch paginated transactions', async () => {
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

  it('should fetch transaction by hash', async () => {
    const hash = Hash('a1e43d0600935ad2243051b81369e3c8e7871998af3c76237da0089a868c607c');

    const tx = await provider.getTx({ hash });
    expect(tx).toBeDefined();
    expect(tx.hash).toEqual(hash);

    const { data: bfTx } = await bfTxClient.txsHashGet(hash);
    const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(hash);

    console.dir({ tx, bfTx, bfUtxos }, { depth: null });

    expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
  });

  it('should filter transactions by address', async () => {
    const latest = await provider.getLatestTx();
    const address = latest.outputs[0].address;

    const filtered = await provider.getTxs({
      limit: 5,
      query: { address: address as any }
    });

    expect(filtered.data.length).toBeGreaterThan(0);
    expect(filtered.total).toBeGreaterThan(0n);

    const found = filtered.data.find((tx) => tx.hash === latest.hash);
    expect(found).toBeDefined();
  });
});
