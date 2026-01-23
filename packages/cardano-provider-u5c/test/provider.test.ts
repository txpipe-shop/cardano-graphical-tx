import { describe } from 'vitest';
import { U5CProvider } from '../src/index';
import {
    CardanoTransactionsApi,
    CardanoBlocksApi,
    CardanoEpochsApi,
    CardanoAddressesApi,
    Configuration
} from '@laceanatomy/blockfrost-sdk';
import { testEnv, TestEnv } from './setup';
import { defineProviderSuite } from '@laceanatomy/provider-tests';
import { createGrpcTransport } from '@connectrpc/connect-node';

describe('U5CProvider', () => {
    let config: TestEnv;

    defineProviderSuite({
        providerName: 'U5CProvider',
        createProvider: async () => {
            config = testEnv.parse(process.env);
            const transport = createGrpcTransport({
                baseUrl: config.U5C_URL,
                httpVersion: '2',
            });
            return new U5CProvider({ transport });
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
                addresses: new CardanoAddressesApi(bfConfig)
            };
        }
    });
});
