import { DbSyncProvider } from '@/providers/cardano/db-sync';
import { DolosProvider } from '@/providers/cardano/dolos';
import type { DbSyncConfig, DolosConfig, ProviderConfig } from '@/types/provider-config';
import assert from 'assert';

export function createProviderClient(config: ProviderConfig) {
  switch (config.type) {
    case 'dolos':
      return createDolosClient(config);
    case 'dbsync':
      return createDbSyncClient(config);
    default:
      throw new Error(`Unsupported provider type`);
  }
}

function createDolosClient(config: DolosConfig) {
  assert.ok(config.miniBfUrl && config.miniBfApiKey && config.utxoRpcUrl && config.utxoRpcApiKey);
  return new DolosProvider({
    utxoRpc: {
      uri: config.utxoRpcUrl,
      headers: { 'dmtr-api-key': config.utxoRpcApiKey }
    },
    miniBf: { uri: config.miniBfUrl, headers: { 'dmtr-api-key': config.miniBfApiKey } }
  });
}

function createDbSyncClient(config: DbSyncConfig) {
  assert.ok(config.connectionString);
  return new DbSyncProvider({ connectionString: config.connectionString });
}
