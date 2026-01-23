import { definePerformanceSuite } from '../src/index';

const mockProvider = {
    getLatestTx: async () => ({ hash: 'test' }),
} as any;

definePerformanceSuite({
    providerName: 'MockProvider',
    createProvider: async () => mockProvider,
    scenarios: [
        {
            name: 'getLatestTx',
            run: async (provider) => {
                await provider.getLatestTx();
            },
        },
    ],
    options: {
        duration: 1000,
        warmup: 500,
        concurrency: 5,
    },
});
