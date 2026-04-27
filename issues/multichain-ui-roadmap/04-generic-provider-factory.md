# 04 — Create Generic Provider Resolution Factory

## Summary

Replace the chain-specific provider constructors (`getDolosProvider(chain)`, `getU5CProviderNode(port)`) with a single `resolveProvider(chainId)` factory that instantiates the correct `ChainProvider` for any chain.

## Motivation

Currently two server-side utilities manually construct providers:

- `server/api/dolos-provider.ts` — `getDolosProvider(chain: Network)` — hardcoded to Dolos + Blockfrost
- `server/api/u5c-provider.ts` — `getU5CProviderNode(port: number)` — hardcoded to U5C for devnet
- Client-side `app/_utils/u5c-provider-web.ts` — hardcoded U5C gRPC-web

Every explorer page re-implements the provider-construction logic inline. Adding a new chain type means touching every page.

## Proposed Design

### `resolveProvider(chainId: ChainId, location: 'server' | 'client'): ChainProvider`

```ts
import { ChainProvider } from '@laceanatomy/provider-core';
import type { ChainDescriptor } from './chain-registry';

type BackendType = 'dolos' | 'u5c' | 'dbsync' | 'mock';

interface ProviderConfig {
  backend: BackendType;
  /** Transport URL (gRPC for dolos/u5c, connection string for dbsync) */
  url: string;
  /** Blockfrost URL + key (dolos only) */
  blockfrostUrl?: string;
  blockfrostApiKey?: string;
  /** Address prefix */
  addressPrefix: string;
  /** DB connection pool (dbsync only) */
  poolConfig?: { ... };
}

export function resolveProvider(
  chainId: string,
  location: 'server' | 'client'
): ChainProvider<UTxO, Tx<UTxO>, BaseChain<UTxO, Tx<UTxO>>> {
  const descriptor = chainRegistry[chainId];
  if (!descriptor) throw new Error(`Unknown chain: ${chainId}`);

  const config = descriptor.providers.default;
  // For devnet client-side, use gRPC-web transport
  const transport = location === 'client'
    ? createTransportWeb(config.url)
    : createTransportNode(config.url);

  switch (config.backend) {
    case 'dolos':
      return new DolosProvider({ transport, ...config });
    case 'u5c':
      return new U5CProvider({ transport });
    case 'dbsync':
      return new DbSyncProvider({ pool: createPool(config.poolConfig), ...config });
    default:
      throw new Error(`Unknown backend: ${config.backend}`);
  }
}
```

### Provider configuration

The provider config lives in the chain descriptor (#01), not in env vars directly. Env vars are read when building the registry, keeping the page components clean:

```ts
// chain-registry.ts
const cardanoMainnet: ChainDescriptor = {
  id: 'cardano-mainnet',
  providers: {
    default: {
      backend: 'dolos',
      url: env.CARDANO_MAINNET_DOLOS_UTXORPC_URL,
      blockfrostUrl: env.CARDANO_MAINNET_DOLOS_BLOCKFROST_URL,
      blockfrostApiKey: env.MAINNET_BLOCKFROST_KEY,
      addressPrefix: 'addr',
    },
  },
};
```

### What about devnet client-side?

Devnet is the only network with a browser-side gRPC connection. The provider config marks a network as `supportsClientTransport: true`. The `useNetwork` hook and `NetSelector` check this flag instead of hardcoding `network === NETWORK.DEVNET`.

## Acceptance Criteria

- [ ] `resolveProvider(chainId, location)` works for all 4 Cardano networks
- [ ] Server-side explorer pages call `resolveProvider` instead of importing dolos-provider.ts directly
- [ ] Client-side devnet connection uses the same factory with `location: 'client'`
- [ ] `supportsClientTransport` flag replaces hardcoded devnet checks
- [ ] Provider config in chain descriptor replaces scattered env var reads
- [ ] Existing explorer pages work identically

## Dependencies

- #01 (`ChainDescriptor` type and registry)

## Dependents

- #03 (explorer data flow generic)
- #09 (explorer routing)
- #12 (decouple Cardano provider imports)
