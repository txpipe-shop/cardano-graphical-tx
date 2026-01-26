import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChainProvider } from '@laceanatomy/provider-core';
import {
  CardanoTransactionsApi,
  CardanoBlocksApi,
  CardanoAddressesApi,
  CardanoEpochsApi,
  Configuration
} from '@laceanatomy/blockfrost-sdk';
import {
  cardano,
  Hash,
  Unit,
  Address,
  DatumType,
  hexToBech32,
  HexString
} from '@laceanatomy/types';
import { toEqualBfTx } from './matchers/toEqualBfTx';
import { toEqualBfBlock } from './matchers/toEqualBfBlock';
import { toEqualBfEpoch } from './matchers/toEqualBfEpoch';
import './types';

expect.extend({ toEqualBfTx, toEqualBfBlock, toEqualBfEpoch });

export type TestVectors = {
  txHash: string;
  block?: {
    hash: string;
    height: bigint;
    slot: bigint;
  };
  address?: {
    withUtxos: string;
    withNativeAssets?: string;
    empty?: string;
  };
};

export type ProviderTestSuiteOptions = {
  providerName: string;
  createProvider: () => Promise<ChainProvider<cardano.UTxO, cardano.Tx, any>>;
  createBlockfrost: () => Promise<{
    transactions: CardanoTransactionsApi;
    blocks: CardanoBlocksApi;
    epochs: CardanoEpochsApi;
    addresses: CardanoAddressesApi;
  }>;
  cleanup?: (provider: ChainProvider<cardano.UTxO, cardano.Tx, any>) => Promise<void>;
  testVectors?: TestVectors;
};

export function defineProviderSuite(options: ProviderTestSuiteOptions) {
  const { providerName, createProvider, createBlockfrost, cleanup, testVectors } = options;

  describe(`Correctness Tests: ${providerName}`, () => {
    let provider: ChainProvider<cardano.UTxO, cardano.Tx, any>;
    let bfClient: {
      transactions: CardanoTransactionsApi;
      blocks: CardanoBlocksApi;
      epochs: CardanoEpochsApi;
      addresses: CardanoAddressesApi;
    };

    beforeAll(async () => {
      provider = await createProvider();
      bfClient = await createBlockfrost();
    });

    afterAll(async () => {
      if (cleanup && provider) {
        await cleanup(provider);
      }
    });

    // Helper to get a valid transaction hash (either from vectors or latest)
    async function getTxHash(): Promise<string> {
      if (testVectors?.txHash) return testVectors.txHash;
      const latest = await provider.getLatestTx();
      return latest.hash.toString();
    }

    describe('Transactions', () => {
      describe('getTx (single transaction by hash)', () => {
        it('should fetch transaction and match Blockfrost', async () => {
          const hash = await getTxHash();
          const tx = await provider.getTx({ hash: Hash(hash) });

          expect(tx).toBeDefined();
          expect(tx.hash.toString()).toBe(hash);

          const { data: txContent } = await bfClient.transactions.txsHashGet(hash);
          const { data: txContentUtxo } = await bfClient.transactions.txsHashUtxosGet(hash);

          expect(tx).toEqualBfTx({ tx: txContent, utxos: txContentUtxo });
        });
      });

      describe('getTxs (paginated transactions)', () => {
        it('should fetch paginated transactions', async () => {
          const page1 = await provider.getTxs({ limit: 5n, query: undefined });
          expect(page1.data.length).toBeLessThanOrEqual(5);
          expect(page1.data.length).toBeGreaterThan(0);
          expect(page1.total).toBeGreaterThan(0n);
        });

        it('should fetch paginated transactions and match Blockfrost for each', async () => {
          const page = await provider.getTxs({ limit: 3n, query: undefined });
          expect(page.data.length).toBeGreaterThan(0);

          for (const tx of page.data) {
            const { data: bfTx } = await bfClient.transactions.txsHashGet(tx.hash.toString());
            const { data: bfUtxos } = await bfClient.transactions.txsHashUtxosGet(
              tx.hash.toString()
            );
            expect(tx).toEqualBfTx({ tx: bfTx, utxos: bfUtxos });
          }
        });

        describe('Filters', () => {
          it('should filter transactions by block hash', async () => {
            let blockHash = testVectors?.block?.hash;
            if (!blockHash) {
              const latest = await provider.getLatestTx();
              blockHash = latest.block!.hash.toString();
            }

            const filtered = await provider.getTxs({
              limit: 5n,
              query: { block: { hash: Hash(blockHash!) } }
            });

            expect(filtered.data.length).toBeGreaterThan(0);
            for (const tx of filtered.data) {
              expect(tx.block!.hash.toString()).toBe(blockHash);
            }
          });

          it('should filter transactions by block height', async () => {
            let blockHeight = testVectors?.block?.height;
            if (blockHeight === undefined) {
              const latest = await provider.getLatestTx();
              blockHeight = BigInt(latest.block!.height);
            }

            const filtered = await provider.getTxs({
              limit: 5n,
              query: { block: { height: blockHeight } }
            });

            expect(filtered.data.length).toBeGreaterThan(0);
            for (const tx of filtered.data) {
              expect(BigInt(tx.block!.height)).toBe(blockHeight);
            }
          });

          it('should filter transactions by block slot', async () => {
            let blockSlot: bigint | undefined;
            if (testVectors?.block?.slot !== undefined) {
              blockSlot = testVectors.block.slot;
            } else {
              const latest = await provider.getLatestTx();
              blockSlot = BigInt(latest.block!.slot);
            }

            const filtered = await provider.getTxs({
              limit: 5n,
              query: { block: { slot: blockSlot } }
            });

            expect(filtered.data.length).toBeGreaterThan(0);
          });
        });
      });
    });

    describe('Blocks', () => {
      describe('getBlocks', () => {
        it('should fetch paginated blocks and match Blockfrost', async () => {
          const result = await provider.getBlocks({
            limit: 3n,
            offset: undefined,
            query: undefined
          });
          expect(result.data.length).toBeLessThanOrEqual(3);
          expect(result.data.length).toBeGreaterThan(0);

          for (const block of result.data) {
            const { data: bfBlock } = await bfClient.blocks.blocksHashOrNumberGet(
              block.hash.toString()
            );
            expect(block).toEqualBfBlock(bfBlock);
          }
        });
      });

      describe('getBlock', () => {
        it('should fetch block by hash and match Blockfrost', async () => {
          let hash = testVectors?.block?.hash;
          if (!hash) {
            const { data } = await provider.getBlocks({ limit: 1n, query: undefined });
            hash = data[0]!.hash.toString();
          }

          const block = await provider.getBlock({ hash: Hash(hash) });
          const { data: bfBlock } = await bfClient.blocks.blocksHashOrNumberGet(hash);
          expect(block).toEqualBfBlock(bfBlock);
        });

        it('should fetch block by height and match Blockfrost', async () => {
          let height = testVectors?.block?.height;
          if (height === undefined) {
            const { data } = await provider.getBlocks({ limit: 1n, query: undefined });
            height = BigInt(data[0]!.height);
          }

          const block = await provider.getBlock({ height });
          const { data: bfBlock } = await bfClient.blocks.blocksHashOrNumberGet(
            block.hash.toString()
          );
          expect(block).toEqualBfBlock(bfBlock);
        });
      });
    });

    describe('Epochs', () => {
      it('should fetch paginated epochs and match Blockfrost', async () => {
        const result = await provider.getEpochs({ limit: 3n, query: undefined });
        expect(result.data.length).toBeGreaterThan(0);

        for (const epoch of result.data) {
          const { data: bfEpoch } = await bfClient.epochs.epochsNumberGet(Number(epoch.index));
          expect(epoch).toEqualBfEpoch(bfEpoch);
        }
      });
    });

    describe('Addresses', () => {
      async function getAddressWithUtxos(): Promise<string> {
        if (testVectors?.address?.withUtxos) return testVectors.address.withUtxos;
        const latest = await provider.getLatestTx();
        // fallback to checking outputs manually
        return latest.outputs[0]!.address.toString();
      }

      describe('getAddressFunds', () => {
        it('should match Blockfrost for address funds', async () => {
          const addressStr = await getAddressWithUtxos();
          const address = Address(addressStr);
          const funds = await provider.getAddressFunds({ address });

          const { data: bfAddress } = await bfClient.addresses.addressesAddressGet(addressStr);

          const bfLovelace = BigInt(
            bfAddress.amount.find((a) => a.unit === 'lovelace')?.quantity || '0'
          );
          expect(funds.value[Unit('lovelace')]).toBe(bfLovelace);

          // Check other assets
          const bfAssets = bfAddress.amount.filter((a) => a.unit !== 'lovelace');
          for (const asset of bfAssets) {
            const unit = Unit(asset.unit);
            const bfQty = BigInt(asset.quantity);
            expect(funds.value[unit] || 0n).toBe(bfQty);
          }
        });

        it('should return firstSeen and lastSeen stats for an active address', async () => {
          const addressStr = await getAddressWithUtxos();
          const address = Address(addressStr);
          const funds = await provider.getAddressFunds({ address });

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

      describe('getAddressUTxOs', () => {
        it('should match Blockfrost UTXOs for an address', async () => {
          const addressStr = await getAddressWithUtxos();
          const address = Address(addressStr);
          const result = await provider.getAddressUTxOs({
            query: { address },
            limit: 50n
          });

          const { data: bfUtxos } = await bfClient.addresses.addressesAddressUtxosGet(
            addressStr,
            50
          );

          expect(result.data.length).toBeLessThanOrEqual(bfUtxos.length);

          const bfUtxoMap = new Map();
          for (const utxo of bfUtxos) {
            bfUtxoMap.set(`${utxo.tx_hash}#${utxo.output_index}`, utxo);
          }

          for (const utxo of result.data) {
            const key = `${utxo.outRef.hash}#${utxo.outRef.index}`;
            const bfUtxo = bfUtxoMap.get(key);
            expect(bfUtxo).toBeDefined();
            if (bfUtxo) {
              const bfCoin = BigInt(
                bfUtxo.amount.find((a: any) => a.unit === 'lovelace')?.quantity || '0'
              );
              expect(utxo.coin).toBe(bfCoin);
            }
          }
        });
      });
    });
  });
}
