import { createGrpcTransport } from '@laceanatomy/utxorpc-sdk/transport/web';

export function createTransport(baseUrl: string, headers?: Record<string, string>) {
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
