import type { ProviderConfig } from './types';
import { U5CProvider } from '@laceanatomy/cardano-provider-u5c';
import { createTransport as createBrowserTransport } from './u5c/web-loader';

export function loadProviderClient(config: ProviderConfig) {
  switch (config.type) {
    case 'u5c': {
      return new U5CProvider({
        transport: createBrowserTransport(
          config.utxoRpcUrl,
          config.utxoRpcApiKey ? { 'dmtr-api-key': config.utxoRpcApiKey } : undefined
        )
      });
    }
    case 'dbsync': {
      throw new Error('DbSyncProvider is not supported in the browser');
    }
  }
}
