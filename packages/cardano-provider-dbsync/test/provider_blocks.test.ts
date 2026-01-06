import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import { testEnv, TestEnv } from './setup';
import { Hash } from '@alexandria/types';
import {
  CardanoBlocksApi,
  CardanoEpochsApi,
  CardanoTransactionsApi,
  Configuration
} from '@alexandria/blockfrost-sdk';
import { toEqualBfBlock } from './matchers/toEqualBfBlock';
import { toEqualBfEpoch } from './matchers/toEqualBfEpoch';

expect.extend({ toEqualBfBlock, toEqualBfEpoch });

describe('DbSyncProvider Blocks & Epochs', () => {
  let pool: Pool;
  let provider: DbSyncProvider;
  let config: TestEnv;
  let bfBlocksClient: CardanoBlocksApi;
  let bfEpochsClient: CardanoEpochsApi;

  beforeAll(() => {
    config = testEnv.parse(process.env);
    pool = new Pool({ connectionString: config.DB_CONNECTION_STRING });
    provider = new DbSyncProvider({ pool });
    const bfConfig = new Configuration({ basePath: config.BF_URL });
    bfBlocksClient = new CardanoBlocksApi(bfConfig);
    bfEpochsClient = new CardanoEpochsApi(bfConfig);
  });

  afterAll(async () => {
    if (provider) {
      await provider.close();
    }
  });

  describe('getBlocks', () => {
    it('should fetch paginated blocks and match Blockfrost', async () => {
      const result = await provider.getBlocks({ limit: 5 });
      expect(result.data.length).toBeLessThanOrEqual(5);
      expect(result.data.length).toBeGreaterThan(0);

      for (const block of result.data) {
        const { data: bfBlock } = await bfBlocksClient.blocksHashOrNumberGet(block.hash);
        expect(block).toEqualBfBlock(bfBlock);
      }
    });
  });

  describe('getBlock', () => {
    it('should fetch block by hash and match Blockfrost', async () => {
      const hash = Hash('09f7fe47a33156f38e38563e48a199b88c87f41afb7fbcd70e68cd6fab80ebab');
      const block = await provider.getBlock({ hash });

      const { data: bfBlock } = await bfBlocksClient.blocksHashOrNumberGet(hash);
      expect(block).toEqualBfBlock(bfBlock);
    });

    it('should fetch block by height and match Blockfrost', async () => {
      const { data } = await provider.getBlocks({ limit: 1 });
      const targetBlock = data[0]!;

      const block = await provider.getBlock({ height: BigInt(targetBlock.height) });

      const { data: bfBlock } = await bfBlocksClient.blocksHashOrNumberGet(block.hash);
      expect(block).toEqualBfBlock(bfBlock);
    });

    it('should fetch block by slot and match Blockfrost', async () => {
      const { data } = await provider.getBlocks({ limit: 1 });
      const targetBlock = data[0]!;

      const block = await provider.getBlock({ slot: BigInt(targetBlock.slot) });

      const { data: bfBlock } = await bfBlocksClient.blocksHashOrNumberGet(block.hash);
      expect(block).toEqualBfBlock(bfBlock);
    });
  });

  describe('getEpochs', () => {
    it('should fetch paginated epochs and match Blockfrost', async () => {
      const result = await provider.getEpochs({ limit: 1 });

      if (result.data.length > 0) {
        expect(result.data.length).toBeLessThanOrEqual(3);

        for (const epoch of result.data) {
          const { data: bfEpoch } = await bfEpochsClient.epochsNumberGet(Number(epoch.index));
          expect(epoch).toEqualBfEpoch(bfEpoch);
        }
      }
    });
  });
});
