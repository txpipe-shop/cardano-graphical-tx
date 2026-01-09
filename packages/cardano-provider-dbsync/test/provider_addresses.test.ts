import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import {
  CardanoAddressesApi,
  Configuration,
  AddressContent,
  AddressUtxoContentInner
} from '@laceanatomy/blockfrost-sdk';
import { Address, Unit, DatumType, hexToBech32, HexString } from '@laceanatomy/types';
import { testEnv, TestEnv } from './setup';

describe('DbSyncProvider - Address Queries', () => {
  let pool: Pool;
  let provider: DbSyncProvider;
  let bfAddressClient: CardanoAddressesApi;
  let config: TestEnv;

  beforeAll(() => {
    config = testEnv.parse(process.env);
    pool = new Pool({ connectionString: config.DB_CONNECTION_STRING });
    provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });
    bfAddressClient = new CardanoAddressesApi(new Configuration({ basePath: config.BF_URL }));
  });

  afterAll(async () => {
    if (provider) {
      await provider.close();
    }
  });

  describe('getAddressFunds', () => {
    it('should return funds for an address with UTXOs', async () => {
      const latestTx = await provider.getLatestTx();
      const addressWithUtxos = latestTx.outputs[0]?.address;

      if (!addressWithUtxos) {
        throw new Error('No address found in latest transaction');
      }

      const funds = await provider.getAddressFunds({ address: addressWithUtxos });

      expect(funds).toBeDefined();
      expect(funds.value[Unit('lovelace')]).toBeDefined();
      expect(typeof funds.value[Unit('lovelace')]).toBe('bigint');
      expect(typeof funds.txCount).toBe('bigint');
    });

    it('should match Blockfrost for address funds', async () => {
      const latestTx = await provider.getLatestTx();
      const addressWithUtxos = latestTx.outputs[0]?.address;

      if (!addressWithUtxos) {
        throw new Error('No address found in latest transaction');
      }

      const funds = await provider.getAddressFunds({ address: addressWithUtxos });

      const { data: bfAddress } = await bfAddressClient.addressesAddressGet(
        hexToBech32(HexString(addressWithUtxos), 'addr')
      );

      const bfLovelace = BigInt(
        bfAddress.amount.find((a) => a.unit === 'lovelace')?.quantity || '0'
      );
      const receivedLovelace = funds.value[Unit('lovelace')] || 0n;

      expect(receivedLovelace).toBe(bfLovelace);

      const bfAssets = bfAddress.amount.filter((a) => a.unit !== 'lovelace');
      for (const asset of bfAssets) {
        const unit = Unit(asset.unit);
        const bfQuantity = BigInt(asset.quantity);
        const receivedQuantity = funds.value[unit] || 0n;
        expect(receivedQuantity).toBe(bfQuantity);
      }

      const bfAssetUnits = new Set(bfAssets.map((a) => a.unit));
      for (const [unit, quantity] of Object.entries(funds.value)) {
        if (unit === 'lovelace') continue;
        if (!bfAssetUnits.has(unit)) {
          expect(quantity).toBe(0n);
        }
      }
    });
  });

  describe('getAddressUTxOs', () => {
    it('should return UTXOs for an address', async () => {
      const latestTx = await provider.getLatestTx();
      const addressWithUtxos = latestTx.outputs[0]?.address;

      if (!addressWithUtxos) {
        throw new Error('No address found in latest transaction');
      }

      const result = await provider.getAddressUTxOs({
        query: { address: addressWithUtxos },
        limit: 10n
      });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.total).toBe('bigint');
    });

    it('should match Blockfrost UTXOs for an address', async () => {
      const latestTx = await provider.getLatestTx();
      const addressWithUtxos = latestTx.outputs[0]?.address;

      if (!addressWithUtxos) {
        throw new Error('No address found in latest transaction');
      }

      const result = await provider.getAddressUTxOs({
        query: { address: addressWithUtxos },
        // TODO: do this more efficiently
        limit: 100n
      });

      const { data: bfUtxos } = await bfAddressClient.addressesAddressUtxosGet(
        hexToBech32(HexString(addressWithUtxos), 'addr'),
        100
      );

      expect(result.total).toBe(BigInt(bfUtxos.length));

      // make a map of BF UTxOs for easy lookup
      const bfUtxoMap = new Map<string, AddressUtxoContentInner>();
      for (const utxo of bfUtxos) {
        const key = `${utxo.tx_hash}#${utxo.output_index}`;
        bfUtxoMap.set(key, utxo);
      }

      // check each utxo exists in bf response
      for (const utxo of result.data) {
        const key = `${utxo.outRef.hash}#${utxo.outRef.index}`;
        const bfUtxo = bfUtxoMap.get(key);

        expect(bfUtxo).toBeDefined();
        if (!bfUtxo) continue;

        expect(Address(utxo.address)).toBe(Address(bfUtxo.address));

        const bfCoin = BigInt(bfUtxo.amount.find((a) => a.unit === 'lovelace')?.quantity || '0');
        expect(utxo.coin).toBe(bfCoin);

        const bfAssets = bfUtxo.amount.filter((a) => a.unit !== 'lovelace');
        for (const asset of bfAssets) {
          const unit = Unit(asset.unit);
          const bfQuantity = BigInt(asset.quantity);
          const receivedQuantity = utxo.value[unit] || 0n;
          expect(receivedQuantity).toBe(bfQuantity);
        }

        if (bfUtxo.inline_datum) {
          expect(utxo.datum).toBeDefined();
          expect(utxo.datum?.type).toBe(DatumType.INLINE);
        } else if (bfUtxo.data_hash) {
          expect(utxo.datum).toBeDefined();
          expect(utxo.datum?.type).toBe(DatumType.HASH);
          if (utxo.datum?.type === DatumType.HASH) {
            expect(utxo.datum.datumHashHex).toBe(bfUtxo.data_hash);
          }
        } else {
          expect(utxo.datum).toBeUndefined();
        }
      }
    });

    it('should handle pagination correctly', async () => {
      const addressWithUtxos = Address(
        'addr1q8z6ty5v2yk5crjpdx7rswru92lhlryxh7xwc9mfzdmg855kn8exqdeytyq2uvd88av4l05qrpnh4aynhj6mtpetczys0jr0a0'
      );

      if (!addressWithUtxos) {
        throw new Error('No address found in latest transaction');
      }

      const page1 = await provider.getAddressUTxOs({
        query: { address: addressWithUtxos },
        limit: 2n
      });

      expect(page1.data.length).toBeLessThanOrEqual(2);

      if (page1.total > 2n) {
        const page2 = await provider.getAddressUTxOs({
          query: { address: addressWithUtxos },
          limit: 2n,
          offset: 2n
        });

        const page1Refs = new Set(page1.data.map((u) => `${u.outRef.hash}#${u.outRef.index}`));
        for (const utxo of page2.data) {
          const ref = `${utxo.outRef.hash}#${utxo.outRef.index}`;
          expect(page1Refs.has(ref)).toBe(false);
        }
      }
    });

    it('should return empty array for address without UTXOs', async () => {
      // Use a random address unlikely to have UTXOs
      const emptyAddress = Address(
        'addr1qxqs59lphg8g6qndelq8xwqn60ag3aeyfcp33c2kdp46a09re5df3pzwwmyq946axfcejy5n4x0y99wqpgtp2gd0k09qsgy6pz'
      );

      const result = await provider.getAddressUTxOs({
        query: { address: emptyAddress },
        limit: 10n
      });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0n);
    });

    it('should handle address with native assets', async () => {
      // Get paginated transactions and find one with native assets
      const txs = await provider.getTxs({ limit: 10n, query: undefined });
      const txWithAssets = txs.data.find((tx) =>
        tx.outputs.some((out) => Object.keys(out.value).length > 0)
      );

      if (!txWithAssets) {
        console.log('No transaction with native assets found, skipping test');
        return;
      }

      const outputWithAssets = txWithAssets.outputs.find(
        (out) => Object.keys(out.value).length > 0
      );
      if (!outputWithAssets) {
        console.log('No output with native assets found, skipping test');
        return;
      }

      const result = await provider.getAddressUTxOs({
        query: { address: outputWithAssets.address },
        limit: 100n
      });

      const { data: bfUtxos } = await bfAddressClient.addressesAddressUtxosGet(
        hexToBech32(HexString(outputWithAssets.address), 'addr'),
        100
      );

      if (result.data.length > 0 && bfUtxos.length > 0) {
        const bfUtxoMap = new Map<string, AddressUtxoContentInner>();
        for (const utxo of bfUtxos) {
          const key = `${utxo.tx_hash}#${utxo.output_index}`;
          bfUtxoMap.set(key, utxo);
        }

        let foundMatchingUtxo = false;
        for (const utxo of result.data) {
          const key = `${utxo.outRef.hash}#${utxo.outRef.index}`;
          const bfUtxo = bfUtxoMap.get(key);

          if (bfUtxo && Object.keys(utxo.value).length > 0) {
            foundMatchingUtxo = true;
            const bfAssets = bfUtxo.amount.filter((a) => a.unit !== 'lovelace');

            for (const asset of bfAssets) {
              const unit = Unit(asset.unit);
              expect(utxo.value[unit]).toBe(BigInt(asset.quantity));
            }
            break;
          }
        }

        if (!foundMatchingUtxo) {
          console.log('UTxO with assets was likely spent, skipping asset verification');
        }
      }
    });
  });

  describe('consistency between getAddressFunds and getAddressUTxOs', () => {
    it('should have consistent totals between funds and UTXOs', async () => {
      const latestTx = await provider.getLatestTx();
      const addressWithUtxos = latestTx.outputs[0]?.address;

      if (!addressWithUtxos) {
        throw new Error('No address found in latest transaction');
      }

      const funds = await provider.getAddressFunds({ address: addressWithUtxos });

      const utxos = await provider.getAddressUTxOs({
        query: { address: addressWithUtxos },
        limit: 1000n
      });

      let totalCoin = 0n;
      const totalAssets: Record<string, bigint> = {};

      for (const utxo of utxos.data) {
        totalCoin += utxo.coin;
        for (const [unit, quantity] of Object.entries(utxo.value)) {
          totalAssets[unit] = (totalAssets[unit] || 0n) + quantity;
        }
      }

      expect(funds.value[Unit('lovelace')]).toBe(totalCoin);

      for (const [unit, quantity] of Object.entries(totalAssets)) {
        expect(funds.value[Unit(unit)]).toBe(quantity);
      }
    });
  });
});
