import { describe } from 'vitest';
import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import { CardanoTransactionsApi, Configuration } from '@laceanatomy/blockfrost-sdk';
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
      return new CardanoTransactionsApi(new Configuration({ basePath: config.BF_URL }));
    },
    cleanup: async (provider) => {
      await (provider as DbSyncProvider).close();
    }
  });
});
