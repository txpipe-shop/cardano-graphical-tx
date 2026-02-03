import { describe } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import {
  CardanoTransactionsApi,
  CardanoBlocksApi,
  CardanoEpochsApi,
  CardanoAddressesApi,
  CardanoPoolsApi,
  Configuration
} from '@laceanatomy/blockfrost-sdk';
import { testEnv, TestEnv } from './setup';
import { defineProviderSuite } from '@laceanatomy/provider-tests';

describe('DbSyncProvider', () => {
  let config: TestEnv;

  defineProviderSuite({
    providerName: 'DbSyncProvider',
    createProvider: async () => {
      config = testEnv.parse(process.env);
      const pool = new Pool({ connectionString: config.DB_CONNECTION_STRING });
      return new DbSyncProvider({
        pool,
        addrPrefix: 'addr',
        nodeUrl: 'http://localhost:5521',
        magic: 764824073
      });
    },
    createBlockfrost: async () => {
      config = testEnv.parse(process.env);
      const bfConfig = new Configuration({ basePath: config.BF_URL });
      return {
        transactions: new CardanoTransactionsApi(bfConfig),
        blocks: new CardanoBlocksApi(bfConfig),
        epochs: new CardanoEpochsApi(bfConfig),
        addresses: new CardanoAddressesApi(bfConfig),
        pools: new CardanoPoolsApi(bfConfig)
      };
    },
    testVectors: {
      txHash: undefined!,
      block: {
        hash: undefined!, // Let suite find one with transactions
        height: undefined!,
        slot: undefined!
      },
      address: {
        withUtxos:
          'addr1q8z6ty5v2yk5crjpdx7rswru92lhlryxh7xwc9mfzdmg855kn8exqdeytyq2uvd88av4l05qrpnh4aynhj6mtpetczys0jr0a0',
        withNativeAssets: undefined,
        empty:
          'addr1qxqs59lphg8g6qndelq8xwqn60ag3aeyfcp33c2kdp46a09re5df3pzwwmyq946axfcejy5n4x0y99wqpgtp2gd0k09qsgy6pz'
      }
    },
    cleanup: async (provider) => {
      await (provider as DbSyncProvider).close();
    }
  });
});
