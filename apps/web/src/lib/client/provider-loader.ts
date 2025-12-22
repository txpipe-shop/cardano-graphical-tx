import { U5CProvider } from '@alexandria/cardano-provider-u5c';
import { createGrpcTransport } from '@alexandria/utxorpc-sdk/transport/web';
import type { ProviderConfig } from '@/client';
import assert from 'assert';

function createTransport(baseUrl: string, headers?: Record<string, string>) {
  return createGrpcTransport({
    baseUrl,
    interceptors: headers
      ? [
          (next) => async (req) => {
            for (const [key, value] of Object.entries(headers)) {
              req.header.set(key, value);
            }
            return next(req);
          }
        ]
      : []
  });
}

export function createProviderClient(config: ProviderConfig) {
  assert.ok(config.miniBfUrl && config.utxoRpcUrl);
  if (config.isLocal) {
    return new U5CProvider({
      transport: createTransport(config.utxoRpcUrl)
    });
  }
  assert.ok(config.miniBfApiKey && config.utxoRpcApiKey);
  return new U5CProvider({
    transport: createTransport(config.utxoRpcUrl, { 'dmtr-api-key': config.utxoRpcApiKey })
  });
}
