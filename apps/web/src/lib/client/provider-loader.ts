import { DolosProvider } from '@/providers/cardano/utxorpc';
import type { ProviderConfig } from './index';
import assert from 'assert';

export function createProviderClient(config: ProviderConfig) {
  assert.ok(config.miniBfUrl && config.utxoRpcUrl);
  if (config.isLocal) {
    return new DolosProvider({
      utxoRpc: { uri: config.utxoRpcUrl }
    });
  }
  assert.ok(config.miniBfApiKey && config.utxoRpcApiKey);
  return new DolosProvider({
    utxoRpc: { uri: config.utxoRpcUrl, headers: { 'dmtr-api-key': config.utxoRpcApiKey } }
  });
}
