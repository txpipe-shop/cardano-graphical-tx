import { DbSyncProvider } from '@laceanatomy/cardano-provider-dbsync';
import { U5CProvider } from '@laceanatomy/cardano-provider-u5c';
import { Pool } from 'pg';
import { networkToAddrPrefix, type ProviderConfig } from './types';
import { createTransport as createNodeTransport } from './u5c/node-loader';

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
      // TODO: add nodeUrl and magic
      return new DbSyncProvider({
        pool,
        addrPrefix: networkToAddrPrefix(config.network),
        nodeUrl: '',
        magic: 0
      });
    }
    default: {
      throw new Error('Unsupported provider type for server');
    }
  }
}
