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

  describe('getTx (single transaction by hash)', () => {
    it('should fetch latest transaction and match Blockfrost', async () => {
      const tx = await provider.getLatestTx();
      expect(tx).toBeDefined();
      expect(tx.hash).toBeDefined();
      expect(typeof tx.fee).toBe('bigint');
      expect(tx.inputs.length).toBeGreaterThan(0);
      expect(tx.outputs.length).toBeGreaterThan(0);

      const { data: txContent } = await bfTxClient.txsHashGet(tx.hash);
      const { data: txContentUtxo } = await bfTxClient.txsHashUtxosGet(tx.hash);

      expect(tx).toEqualBfTx({ tx: txContent, utxos: txContentUtxo });
    });

    it('should fetch simple transaction by hash', async () => {
      const hash = Hash('a1e43d0600935ad2243051b81369e3c8e7871998af3c76237da0089a868c607c');

      const tx = await provider.getTx({ hash });
      expect(tx).toBeDefined();
      expect(tx.hash).toEqual(hash);

      const { data: bfTx } = await bfTxClient.txsHashGet(hash);
      const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(hash);

      expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
    });

    it('should fetch transaction with mints', async () => {
      const hash = Hash('e4ad1bdbeac49e485618c5a2f373b4c5b26669a78cf4e41e6932e4b0680c4c24');
      const tx = await provider.getTx({ hash });
      expect(tx).toBeDefined();
      expect(tx.hash).toEqual(hash);

      const { data: bfTx } = await bfTxClient.txsHashGet(hash);
      const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(hash);

      expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
    });

    it('should fetch transaction with multiple inputs', async () => {
      // Transaction with multiple inputs to verify ordering
      const hash = Hash('8f7884b0a11e4b5f9f112701fe18ade271f767091b54b2a78782d3f499af683a');
      const tx = await provider.getTx({ hash });
      expect(tx).toBeDefined();
      expect(tx.hash).toEqual(hash);
      expect(tx.inputs.length).toBeGreaterThan(1);

      const { data: bfTx } = await bfTxClient.txsHashGet(hash);
      const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(hash);

      expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
    });

    it('should fetch transaction with multiple outputs', async () => {
      // Transaction with multiple outputs to verify ordering
      const hash = Hash('16e6b6cff88beb7a0e8739318eee8809a489fab856fb7544fe57f998e5c8fde2');
      const tx = await provider.getTx({ hash });
      expect(tx).toBeDefined();
      expect(tx.hash).toEqual(hash);
      expect(tx.outputs.length).toBeGreaterThan(1);

      const { data: bfTx } = await bfTxClient.txsHashGet(hash);
      const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(hash);

      expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
    });

    it('should fetch transaction with datum hash', async () => {
      // Transaction with datum hash on output
      const hash = Hash('4f458fc1f4b4af362b0e3e33160c2d4dbed8935b4b767afe352d0584e969f51a');
      const tx = await provider.getTx({ hash });
      expect(tx).toBeDefined();

      const { data: bfTx } = await bfTxClient.txsHashGet(hash);
      const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(hash);

      expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
    });

    it('should fetch transaction with validity interval', async () => {
      const hash = Hash('8f4d89174767e662edd6c618d7c16d9485da6e4f621ea8f122f971d104a5767a');
      const tx = await provider.getTx({ hash });
      expect(tx).toBeDefined();

      const { data: bfTx } = await bfTxClient.txsHashGet(hash);
      const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(hash);

      expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
    });
  });

  describe('getTxs (paginated transactions)', () => {
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

    it('should fetch paginated transactions and match Blockfrost for each', async () => {
      const page = await provider.getTxs({ limit: 3 });
      expect(page.data.length).toBeGreaterThan(0);

      // each transaction matches Blockfrost
      for (const tx of page.data) {
        const { data: bfTx } = await bfTxClient.txsHashGet(tx.hash);
        const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(tx.hash);

        expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
      }
    });

    it('should filter transactions by address', async () => {
      const latest = await provider.getLatestTx();
      const address = latest.outputs[0].address;
      console.log(address);

      const filtered = await provider.getTxs({
        limit: 5,
        query: { address }
      });

      expect(filtered.data.length).toBeGreaterThan(0);
      expect(filtered.total).toBeGreaterThan(0n);

      const found = filtered.data.find((tx) => tx.hash === latest.hash);
      expect(found).toBeDefined();
    });

    it('should filter transactions by address and match Blockfrost', async () => {
      const latest = await provider.getLatestTx();
      const address = latest.outputs[0].address;

      const filtered = await provider.getTxs({
        limit: 3,
        query: { address: address as any }
      });

      expect(filtered.data.length).toBeGreaterThan(0);

      // each filtered transaction matches Blockfrost
      for (const tx of filtered.data) {
        const { data: bfTx } = await bfTxClient.txsHashGet(tx.hash);
        const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(tx.hash);

        expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
      }
    });

    it('should maintain consistent ordering across pages', async () => {
      const page1 = await provider.getTxs({ limit: 5 });
      expect(page1.data.length).toBe(5);

      if (page1.nextCursor) {
        const page2 = await provider.getTxs({ limit: 5, before: page1.nextCursor });
        expect(page2.data.length).toBeGreaterThan(0);

        // no overlap between pages
        const page1Hashes = new Set(page1.data.map((tx) => tx.hash));
        for (const tx of page2.data) {
          expect(page1Hashes.has(tx.hash)).toBe(false);
        }

        for (const tx of page2.data) {
          const { data: bfTx } = await bfTxClient.txsHashGet(tx.hash);
          const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(tx.hash);

          expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
        }
      }
    });
  });

  describe('input/output ordering', () => {
    it('should return inputs in correct transaction order', async () => {
      const page = await provider.getTxs({ limit: 10 });
      const txWithMultipleInputs = page.data.find((tx) => tx.inputs.length > 1);

      if (txWithMultipleInputs) {
        const { data: bfTx } = await bfTxClient.txsHashGet(txWithMultipleInputs.hash);
        const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(txWithMultipleInputs.hash);

        expect(txWithMultipleInputs).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });

        const bfInputs = bfUtxos.inputs.filter((x) => !x.reference && !x.collateral);
        expect(txWithMultipleInputs.inputs.length).toBe(bfInputs.length);

        for (let i = 0; i < txWithMultipleInputs.inputs.length; i++) {
          const input = txWithMultipleInputs.inputs[i];
          const bfInput = bfInputs[i];
          expect(input.outRef.hash).toBe(bfInput.tx_hash);
          expect(Number(input.outRef.index)).toBe(bfInput.output_index);
        }
      }
    });

    it('should return outputs in correct transaction order', async () => {
      const page = await provider.getTxs({ limit: 10 });
      const txWithMultipleOutputs = page.data.find((tx) => tx.outputs.length > 1);

      if (txWithMultipleOutputs) {
        const { data: bfTx } = await bfTxClient.txsHashGet(txWithMultipleOutputs.hash);
        const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(txWithMultipleOutputs.hash);

        expect(txWithMultipleOutputs).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });

        const bfOutputs = bfUtxos.outputs.filter((x) => !x.collateral);
        expect(txWithMultipleOutputs.outputs.length).toBe(bfOutputs.length);

        for (let i = 0; i < txWithMultipleOutputs.outputs.length; i++) {
          const output = txWithMultipleOutputs.outputs[i];
          const bfOutput = bfOutputs[i];
          expect(Number(output.outRef.index)).toBe(bfOutput.output_index);
        }
      }
    });
  });
});
