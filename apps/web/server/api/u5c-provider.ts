import { U5CProvider } from "@laceanatomy/cardano-provider-u5c";
import { createGrpcTransport as createGrpcTransportNode } from "@laceanatomy/utxorpc-sdk/transport/node";

function createTransportNode(
  baseUrl: string,
  headers?: Record<string, string>,
) {
  return createGrpcTransportNode({
    httpVersion: "2",
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

export function getU5CProviderNode(): U5CProvider {
  // TODO: Change to the correct URL
  return new U5CProvider({
    transport: createTransportNode("http://localhost:50051"),
  });
}

