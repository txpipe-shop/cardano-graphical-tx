import { DolosProvider } from '@/providers/cardano/utxorpc';
import { createGrpcTransport } from '@alexandria/utxorpc-sdk/transport/node';
import type { ProviderConfig } from '@/client';
import assert from 'assert';

function createTransport(baseUrl: string, headers?: Record<string, string>) {
  return createGrpcTransport({
    httpVersion: '2',
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

export function createProviderServer(config: ProviderConfig) {
  assert.ok(config.miniBfUrl && config.utxoRpcUrl);
  if (config.isLocal) {
    return new DolosProvider({
      transport: createTransport(config.utxoRpcUrl)
    });
  }
  assert.ok(config.miniBfApiKey && config.utxoRpcApiKey);
  return new DolosProvider({
    transport: createTransport(config.utxoRpcUrl, { 'dmtr-api-key': config.utxoRpcApiKey })
  });
}
