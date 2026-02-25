import { describe } from 'vitest';
import { DolosProvider } from '../src/index';
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
import { createGrpcTransport } from '@connectrpc/connect-node';

describe('DolosProvider', () => {
  let config: TestEnv;

  defineProviderSuite({
    providerName: 'DolosProvider',
    createProvider: async () => {
      config = testEnv.parse(process.env);
      const transport = createGrpcTransport({
        baseUrl: config.UTXORPC_URL,
        httpVersion: '2'
      });
      return new DolosProvider({ transport, minibfUrl: config.MINIBF_URL, addressPrefix: 'addr_test' });
    },
    createBlockfrost: async () => {
      config = testEnv.parse(process.env);
      const bfConfig = new Configuration({
        basePath: config.BF_URL,
        apiKey: config.BF_PID
      });
      return {
        transactions: new CardanoTransactionsApi(bfConfig),
        blocks: new CardanoBlocksApi(bfConfig),
        epochs: new CardanoEpochsApi(bfConfig),
        addresses: new CardanoAddressesApi(bfConfig),
        pools: new CardanoPoolsApi(bfConfig)
      };
    }
  });
});
