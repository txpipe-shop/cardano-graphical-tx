import { Pool } from 'pg';
import { DbSyncProvider } from '../src/index';
import { testEnv, TestEnv } from './setup';
import { definePerformanceSuite } from '@laceanatomy/provider-tests';
import { Address } from '@laceanatomy/types';

let config: TestEnv;

definePerformanceSuite({
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
  cleanup: async (provider) => {
    await (provider as DbSyncProvider).close();
  },
  scenarios: [
    {
      name: 'getLatestTx',
      run: async (provider) => {
        await provider.getLatestTx();
      }
    },
    {
      name: 'getTx (by hash)',
      run: async (provider) => {
        // @ts-ignore
        if (!provider._latestHash) {
          const latest = await provider.getLatestTx();
          // @ts-ignore
          provider._latestHash = latest.hash;
        }
        // @ts-ignore
        await provider.getTx({ hash: provider._latestHash });
      }
    },
    {
      name: 'getBlock (by hash)',
      run: async (provider) => {
        // @ts-ignore
        if (!provider._latestBlockHash) {
          const latest = await provider.getLatestTx();
          // @ts-ignore
          provider._latestBlockHash = latest.block.hash;
        }
        // @ts-ignore
        await provider.getBlock({ hash: provider._latestBlockHash });
      }
    },
    {
      name: 'getTxs (limit 5)',
      run: async (provider) => {
        await provider.getTxs({ limit: 5n, query: undefined });
      }
    },
    {
      name: 'getTxs (limit 5, offset 100)',
      run: async (provider) => {
        await provider.getTxs({ limit: 5n, offset: 100n, query: undefined });
      }
    },
    {
      name: 'getTxs (by address)',
      run: async (provider) => {
        try {
          await provider.getTxs({
            limit: 5n,
            query: {
              address: Address('addr1q8z6ty5v2yk5crjpdx7rswru92lhlryxh7xwc9mfzdmg855kn8exqdeytyq2uvd88av4l05qrpnh4aynhj6mtpetczys0jr0a0')
            }
          });
        } catch (e) {
          console.error('getTxs error:', e);
          throw e;
        }
      }
    },
    {
      name: 'getBlocks (limit 5)',
      run: async (provider) => {
        await provider.getBlocks({ limit: 5n, query: undefined });
      }
    },
    {
      name: 'getBlocks (limit 5, offset 100)',
      run: async (provider) => {
        await provider.getBlocks({ limit: 5n, offset: 100n, query: undefined });
      }
    },
    {
      name: 'getAddressUTxOs',
      run: async (provider) => {
        try {
          await provider.getAddressUTxOs({
            limit: 50n,
            query: {
              address: Address('addr1q8z6ty5v2yk5crjpdx7rswru92lhlryxh7xwc9mfzdmg855kn8exqdeytyq2uvd88av4l05qrpnh4aynhj6mtpetczys0jr0a0')
            }
          });
        } catch (e) {
          console.error('getAddressUTxOs error:', e);
          throw e;
        }
      }
    },
    {
      name: 'getEpochs (limit 5)',
      run: async (provider) => {
        await provider.getEpochs({ limit: 5n, query: undefined });
      }
    },
    {
      name: 'getEpochs (limit 5, offset 10)',
      run: async (provider) => {
        await provider.getEpochs({ limit: 5n, offset: 10n, query: undefined });
      }
    },
    {
      name: 'getBlocks (by epoch)',
      run: async (provider) => {
        await provider.getBlocks({ limit: 5n, query: { epoch: 100n } });
      }
    }
  ],
  options: {
    duration: 5000,
    warmup: 2000,
    concurrency: 10
  }
});
