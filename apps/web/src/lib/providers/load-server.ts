import type { ProviderConfig } from './types';
import { U5CProvider } from '@alexandria/cardano-provider-u5c';
import { createTransport as createNodeTransport } from './u5c/node-loader';
import { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';
import { Pool } from 'pg';

export function loadProviderServer(config: ProviderConfig) {
  switch (config.type) {
    case 'u5c': {
      return new U5CProvider({
        transport: createNodeTransport(
          config.utxoRpcUrl,
          config.utxoRpcApiKey ? { 'dmtr-api-key': config.utxoRpcApiKey } : undefined
        )
      });
    }
    case 'dbsync': {
      const pool = new Pool({ connectionString: config.connectionString });
      return new DbSyncProvider({ pool });
    }
    default: {
      throw new Error('Unsupported provider type for server');
    }
  }
}
