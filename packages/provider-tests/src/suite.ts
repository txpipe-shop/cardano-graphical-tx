import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChainProvider } from '@laceanatomy/provider-core';
import { CardanoTransactionsApi } from '@laceanatomy/blockfrost-sdk';
import { cardano } from '@laceanatomy/types';
import { toEqualBfTx } from './matchers/toEqualBfTx';
import './types';

expect.extend({ toEqualBfTx });

export type ProviderTestSuiteOptions = {
  /**
   * Name of the provider for the suite description
   */
  providerName: string;
  /**
   * Factory function to create the provider instance
   */
  createProvider: () => Promise<ChainProvider<cardano.UTxO, cardano.Tx, any>>;
  /**
   * Factory function to create the Blockfrost client (should point to same network/data source)
   */
  createBlockfrost: () => Promise<CardanoTransactionsApi>;
  /**
   * Optional cleanup function
   */
  cleanup?: (provider: ChainProvider<cardano.UTxO, cardano.Tx, any>) => Promise<void>;
};

export function defineProviderSuite(options: ProviderTestSuiteOptions) {
  const { providerName, createProvider, createBlockfrost, cleanup } = options;

  describe(`Correctness Tests: ${providerName}`, () => {
    let provider: ChainProvider<cardano.UTxO, cardano.Tx, any>;
    let bfTxClient: CardanoTransactionsApi;

    beforeAll(async () => {
      provider = await createProvider();
      bfTxClient = await createBlockfrost();
    });

    afterAll(async () => {
      if (cleanup && provider) {
        await cleanup(provider);
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
    });

    describe('getTxs (paginated transactions)', () => {
      it('should fetch paginated transactions', async () => {
        const page1 = await provider.getTxs({ limit: 5n, query: undefined });
        expect(page1.data.length).toBeLessThanOrEqual(5);
        expect(page1.data.length).toBeGreaterThan(0);
        expect(page1.total).toBeGreaterThan(0n);

        if (page1.total > 5n) {
          const page2 = await provider.getTxs({ limit: 5n, offset: 5n, query: undefined });
          expect(page2.data.length).toBeLessThanOrEqual(5);
          if (page2.data.length > 0 && page1.data.length > 0) {
            expect(page2.data[0]!.hash).not.toBe(page1.data[0]!.hash);
          }
        }
      });

      it('should fetch paginated transactions and match Blockfrost for each', async () => {
        const page = await provider.getTxs({ limit: 3n, query: undefined });
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
        if (latest.outputs.length === 0) throw new Error('Latest transaction has no outputs');
        const address = latest.outputs[0]!.address;

        const filtered = await provider.getTxs({
          limit: 5n,
          query: { address }
        });

        expect(filtered.data.length).toBeGreaterThan(0);
        expect(filtered.total).toBeGreaterThan(0n);

        const found = filtered.data.find((tx: any) => tx.hash === latest.hash);
        expect(found).toBeDefined();
      });

      it('should filter transactions by address and match Blockfrost', async () => {
        const latest = await provider.getLatestTx();
        if (latest.outputs.length === 0) throw new Error('Latest transaction has no outputs');
        const address = latest.outputs[0]!.address;

        const filtered = await provider.getTxs({
          limit: 3n,
          query: { address: address }
        });

        expect(filtered.data.length).toBeGreaterThan(0);

        // each filtered transaction matches Blockfrost
        for (const tx of filtered.data) {
          const { data: bfTx } = await bfTxClient.txsHashGet(tx.hash);
          const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(tx.hash);

          expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
        }
      });
    });

    describe('input/output ordering', () => {
      it('should return inputs in correct transaction order', async () => {
        // Try to find a tx with multiple inputs dynamically
        let txWithMultipleInputs = undefined;
        // Search first few pages
        for (let i = 0; i < 5; i++) {
          const page = await provider.getTxs({
            limit: 20n,
            offset: BigInt(i * 20),
            query: undefined
          });
          txWithMultipleInputs = page.data.find((tx: any) => tx.inputs.length > 1);
          if (txWithMultipleInputs) break;
        }

        if (txWithMultipleInputs) {
          const { data: bfTx } = await bfTxClient.txsHashGet(txWithMultipleInputs.hash);
          const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(txWithMultipleInputs.hash);

          expect(txWithMultipleInputs).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });

          const bfInputs = bfUtxos.inputs.filter((x) => !x.reference && !x.collateral);
          expect(txWithMultipleInputs.inputs.length).toBe(bfInputs.length);

          for (let i = 0; i < txWithMultipleInputs.inputs.length; i++) {
            const input = txWithMultipleInputs.inputs[i]!;
            const bfInput = bfInputs[i]!;
            expect(input.outRef.hash).toBe(bfInput.tx_hash);
            expect(Number(input.outRef.index)).toBe(bfInput.output_index);
          }
        } else {
          console.warn('Could not find a transaction with multiple inputs to test ordering');
        }
      });

      it('should return outputs in correct transaction order', async () => {
        let txWithMultipleOutputs = undefined;
        // Search first few pages
        for (let i = 0; i < 5; i++) {
          const page = await provider.getTxs({
            limit: 20n,
            offset: BigInt(i * 20),
            query: undefined
          });
          txWithMultipleOutputs = page.data.find((tx: any) => tx.outputs.length > 1);
          if (txWithMultipleOutputs) break;
        }

        if (txWithMultipleOutputs) {
          const { data: bfTx } = await bfTxClient.txsHashGet(txWithMultipleOutputs.hash);
          const { data: bfUtxos } = await bfTxClient.txsHashUtxosGet(txWithMultipleOutputs.hash);

          expect(txWithMultipleOutputs).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });

          const bfOutputs = bfUtxos.outputs.filter((x) => !x.collateral);
          expect(txWithMultipleOutputs.outputs.length).toBe(bfOutputs.length);

          for (let i = 0; i < txWithMultipleOutputs.outputs.length; i++) {
            const output = txWithMultipleOutputs.outputs[i]!;
            const bfOutput = bfOutputs[i]!;
            expect(Number(output.outRef.index)).toBe(bfOutput.output_index);
          }
        } else {
          console.warn('Could not find a transaction with multiple outputs to test ordering');
        }
      });
    });
  });
}
