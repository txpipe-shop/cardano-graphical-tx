import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import { CardanoTransactionsApi, Configuration } from '@alexandria/blockfrost-sdk';
import { testEnv, TestEnv } from './setup';
import { Hash } from '@alexandria/types';

describe('DbSyncProvider Blocks & Epochs', () => {
  let pool: Pool;
  let provider: DbSyncProvider;
  let config: TestEnv;

  beforeAll(() => {
    config = testEnv.parse(process.env);
    pool = new Pool({ connectionString: config.DB_CONNECTION_STRING });
    provider = new DbSyncProvider({ pool });
  });

  afterAll(async () => {
    if (provider) {
      await provider.close();
    }
  });

  describe('getBlocks', () => {
    it('should fetch paginated blocks', async () => {
      const result = await provider.getBlocks({ limit: 5 });
      expect(result.data.length).toBeLessThanOrEqual(5);
      expect(result.data.length).toBeGreaterThan(0);

      const firstBlock = result.data[0];
      expect(firstBlock.hash).toBeDefined();
      expect(firstBlock.height).toBeDefined();
      expect(firstBlock.slot).toBeDefined();
    });
  });

  describe('getBlock', () => {
    it('should fetch block by hash', async () => {
      const hash = Hash('09f7fe47a33156f38e38563e48a199b88c87f41afb7fbcd70e68cd6fab80ebab');
      const height = 2523707n;

      const block = await provider.getBlock({ hash });
      expect(block.hash).toBe(hash);
      expect(block.height).toBe(height);
    });

    it('should fetch block by height', async () => {
      const { data } = await provider.getBlocks({ limit: 1 });
      const targetBlock = data[0];

      const block = await provider.getBlock({ height: BigInt(targetBlock.height) });
      expect(block.hash).toBe(targetBlock.hash);
      expect(block.height).toBe(targetBlock.height);
    });

    it('should fetch block by slot', async () => {
      const { data } = await provider.getBlocks({ limit: 1 });
      const targetBlock = data[0];

      const block = await provider.getBlock({ slot: BigInt(targetBlock.slot) });
      expect(block.hash).toBe(targetBlock.hash);
      expect(block.slot).toBe(targetBlock.slot);
    });
  });

  describe('getEpochs', () => {
    it('should fetch paginated epochs', async () => {
      const result = await provider.getEpochs({ limit: 3 });

      console.log(result);
      if (result.data.length > 0) {
        expect(result.data.length).toBeLessThanOrEqual(3);
        const firstEpoch = result.data[0];
        expect(firstEpoch.epoch).toBeDefined();
        expect(firstEpoch.startTime).toBeDefined();
      }
    });
  });
});
