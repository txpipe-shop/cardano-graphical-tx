import { U5CProvider } from '../src/index';
import { testEnv, TestEnv } from './setup';
import { definePerformanceSuite } from '@laceanatomy/provider-tests';
import { createGrpcTransport } from '@connectrpc/connect-node';

let config: TestEnv;

definePerformanceSuite({
  providerName: 'U5CProvider',
  createProvider: async () => {
    config = testEnv.parse(process.env);
    const transport = createGrpcTransport({
      baseUrl: config.U5C_URL,
      httpVersion: '2'
    });
    return new U5CProvider({ transport });
  },
  scenarios: [
    /*
        {
            name: 'getLatestTx',
            run: async (provider) => {
                await provider.getLatestTx();
            }
        },
        {
            name: 'getTxs (limit 5)',
            run: async (provider) => {
                await provider.getTxs({ limit: 5n });
            }
        },
        {
            name: 'getBlocks (limit 5)',
            run: async (provider) => {
                await provider.getBlocks({ limit: 5n });
            }
        }
        */
  ],
  options: {
    duration: 5000,
    warmup: 2000,
    concurrency: 10
  }
});
