import { createGrpcTransport } from '@alexandria/utxorpc-sdk/transport/node';

export function createTransport(baseUrl: string, headers?: Record<string, string>) {
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
