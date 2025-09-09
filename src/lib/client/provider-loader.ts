import { DolosProvider } from '@/providers/cardano/dolos';
import type { ProviderConfig } from '@/types/provider-config';
import assert from 'assert';

export function createProviderClient(config: ProviderConfig) {
  assert.ok(config.miniBfUrl && config.miniBfApiKey && config.utxoRpcUrl && config.utxoRpcApiKey);
  return new DolosProvider({
    utxoRpc: {
      uri: config.utxoRpcUrl,
      headers: { 'dmtr-api-key': config.utxoRpcApiKey }
    },
    miniBf: { uri: config.miniBfUrl, headers: { 'dmtr-api-key': config.miniBfApiKey } }
  });
}
