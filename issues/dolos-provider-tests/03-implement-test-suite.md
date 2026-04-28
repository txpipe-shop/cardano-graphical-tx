# Issue 03: Implement DolosProvider test suite

> **good first issue** — This issue is beginner-friendly and follows a well-established pattern from the DBSync and U5C providers.

## Goal
Add a comprehensive test suite to `packages/cardano-provider-dolos` using `@laceanatomy/provider-tests`, with support for mainnet, preprod, and preview via hardcoded test vectors.

## Background
`DolosProvider` currently has **zero tests**. Both `DbSyncProvider` and `U5CProvider` use `defineProviderSuite` from `@laceanatomy/provider-tests` to run correctness tests against Blockfrost as the golden reference. We should follow the same pattern.

## Changes

### 1. Add dependencies to `packages/cardano-provider-dolos/package.json`

```json
"devDependencies": {
  "@laceanatomy/provider-tests": "workspace:*",
  "@laceanatomy/typescript-config": "workspace:*",
  "@types/node": "^24.1.0",
  "dotenv": "^16.0.0",
  "typescript": "^5.0.0",
  "vitest": "^1.0.0"
}
```

### 2. Create `packages/cardano-provider-dolos/test/setup.ts`

```ts
import 'dotenv/config';
import z from 'zod';

export const testEnv = z.object({
  DOLOS_U5C_URL: z.string().url(),
  DOLOS_BF_URL: z.string().url(),
  DOLOS_BF_API_KEY: z.string().optional(),
  CHAIN: z.enum(['mainnet', 'preprod', 'preview']).default('mainnet'),
});

export type TestEnv = z.infer<typeof testEnv>;
```

### 3. Create `packages/cardano-provider-dolos/test/provider.test.ts`

```ts
import { describe } from 'vitest';
import { DolosProvider } from '../src/index';
import {
  CardanoTransactionsApi,
  CardanoBlocksApi,
  CardanoEpochsApi,
  CardanoAddressesApi,
  Configuration,
} from '@laceanatomy/blockfrost-sdk';
import { testEnv, TestEnv } from './setup';
import { defineProviderSuite } from '@laceanatomy/provider-tests';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { mainnetVectors } from './vectors/mainnet';
import { preprodVectors } from './vectors/preprod';
import { previewVectors } from './vectors/preview';

const vectorsByChain = {
  mainnet: mainnetVectors,
  preprod: preprodVectors,
  preview: previewVectors,
};

describe('DolosProvider', () => {
  let config: TestEnv;

  defineProviderSuite({
    providerName: 'DolosProvider',
    createProvider: async () => {
      config = testEnv.parse(process.env);
      const transport = createGrpcTransport({
        baseUrl: config.DOLOS_U5C_URL,
        httpVersion: '2',
      });
      return new DolosProvider({
        transport,
        blockfrostUrl: config.DOLOS_BF_URL,
        blockfrostApiKey: config.DOLOS_BF_API_KEY,
        addressPrefix: config.CHAIN === 'mainnet' ? 'addr' : 'addr_test',
      });
    },
    createBlockfrost: async () => {
      config = testEnv.parse(process.env);
      const bfConfig = new Configuration({
        basePath: config.DOLOS_BF_URL,
        apiKey: config.DOLOS_BF_API_KEY,
      });
      return {
        transactions: new CardanoTransactionsApi(bfConfig),
        blocks: new CardanoBlocksApi(bfConfig),
        epochs: new CardanoEpochsApi(bfConfig),
        addresses: new CardanoAddressesApi(bfConfig),
        pools: new (await import('@laceanatomy/blockfrost-sdk')).CardanoPoolsApi(bfConfig),
      };
    },
    testVectors: vectorsByChain[config.CHAIN],
  });
});
```

### 4. Create `packages/cardano-provider-dolos/test/perf.test.ts`

Mirror the pattern from `cardano-provider-dbsync/test/perf.test.ts`:

```ts
import { DolosProvider } from '../src/index';
import { testEnv, TestEnv } from './setup';
import { definePerformanceSuite } from '@laceanatomy/provider-tests';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { Address } from '@laceanatomy/types';

let config: TestEnv;

// Load vectors for the active chain
const vectors = {
  mainnet: () => import('./vectors/mainnet').then((m) => m.mainnetVectors),
  preprod: () => import('./vectors/preprod').then((m) => m.preprodVectors),
  preview: () => import('./vectors/preview').then((m) => m.previewVectors),
};

definePerformanceSuite({
  providerName: 'DolosProvider',
  createProvider: async () => {
    config = testEnv.parse(process.env);
    const transport = createGrpcTransport({
      baseUrl: config.DOLOS_U5C_URL,
      httpVersion: '2',
    });
    return new DolosProvider({
      transport,
      blockfrostUrl: config.DOLOS_BF_URL,
      blockfrostApiKey: config.DOLOS_BF_API_KEY,
      addressPrefix: config.CHAIN === 'mainnet' ? 'addr' : 'addr_test',
    });
  },
  scenarios: [
    {
      name: 'getLatestTx',
      run: async (provider) => {
        await provider.getLatestTx();
      },
    },
    {
      name: 'getTx (by hash)',
      run: async (provider) => {
        const vectors = await vectors[config.CHAIN]();
        await provider.getTx({ hash: vectors.txHash });
      },
    },
    {
      name: 'getBlock (by hash)',
      run: async (provider) => {
        const vectors = await vectors[config.CHAIN]();
        await provider.getBlock({ hash: vectors.block.hash });
      },
    },
    {
      name: 'getTxs (limit 5)',
      run: async (provider) => {
        await provider.getTxs({ limit: 5n, query: undefined });
      },
    },
    {
      name: 'getTxs (limit 5, offset 100)',
      run: async (provider) => {
        await provider.getTxs({ limit: 5n, offset: 100n, query: undefined });
      },
    },
    {
      name: 'getBlocks (limit 5)',
      run: async (provider) => {
        await provider.getBlocks({ limit: 5n, query: undefined });
      },
    },
    {
      name: 'getBlocks (limit 5, offset 100)',
      run: async (provider) => {
        await provider.getBlocks({ limit: 5n, offset: 100n, query: undefined });
      },
    },
  ],
  options: {
    duration: 5000,
    warmup: 2000,
    concurrency: 10,
  },
});
```

### 5. Update `package.json` scripts

```json
"scripts": {
  "build": "tsc",
  "dev": "tsc --watch",
  "lint": "tsc --noEmit",
  "check": "tsc --noEmit",
  "clean": "rm -rf dist",
  "test": "vitest run",
  "test:perf": "vitest run test/perf.test.ts"
}
```

### 6. Update CI

Add a GitHub Actions matrix job that runs DolosProvider tests for all three chains:

```yaml
strategy:
  matrix:
    chain: [mainnet, preprod, preview]
env:
  CHAIN: ${{ matrix.chain }}
  DOLOS_U5C_URL: ${{ secrets.DOLOS_U5C_URL }}
  DOLOS_BF_URL: ${{ secrets.DOLOS_BF_URL }}
  DOLOS_BF_API_KEY: ${{ secrets.DOLOS_BF_API_KEY }}
```

## Acceptance Criteria
- [ ] `test/setup.ts` validates required env vars
- [ ] `test/provider.test.ts` uses `defineProviderSuite` and passes for all 3 chains
- [ ] `test/perf.test.ts` uses `definePerformanceSuite`
- [ ] `package.json` has `test` and `test:perf` scripts
- [ ] CI runs tests in a matrix for mainnet, preprod, preview
- [ ] All tests pass (`pnpm test` in `packages/cardano-provider-dolos`)

## Notes
- `getBlocksWithTxs` is **not** covered by this issue (it doesn't exist yet).
- If a vector is missing for a chain, the suite falls back to `getLatestTx()` with a warning.
- The `CardanoPoolsApi` import may need adjustment based on the actual blockfrost-sdk exports.

## Related
- Previous: [02-lookup-test-vectors.md](02-lookup-test-vectors.md)
- `packages/cardano-provider-dbsync/test/provider.test.ts` (reference implementation)
- `packages/cardano-provider-u5c/test/provider.test.ts` (reference implementation)
