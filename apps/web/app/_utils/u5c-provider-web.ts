import { U5CProvider } from "@laceanatomy/cardano-provider-u5c";
import { createGrpcTransport } from "@laceanatomy/utxorpc-sdk/transport/web";

function createTransportWeb(baseUrl: string, headers?: Record<string, string>) {
  return createGrpcTransport({
    baseUrl,
    interceptors: headers
      ? [
          (next) => async (req) => {
            for (const [key, value] of Object.entries(headers)) {
              req.header.set(key, value);
            }
            return next(req);
          },
        ]
      : [],
  });
}

export function getU5CProviderWeb(devnetPort: number): U5CProvider {
  return new U5CProvider({
    transport: createTransportWeb(`http://localhost:${devnetPort}`),
    addressPrefix: 'addr_test',
  });
}
