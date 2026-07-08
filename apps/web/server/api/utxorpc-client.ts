import { type Network } from "@laceanatomy/types/cardano";
import { UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";
import { createGrpcTransport } from "@laceanatomy/utxorpc-sdk/transport/node";
import { getNetworkConfigServer } from "./server-network-config";

export function getUtxoRpcClient(network: Network): UtxoRpcClient | null {
  const config = getNetworkConfigServer(network);
  if (!config.dolosUtxorpcUrl) return null;

  return new UtxoRpcClient({
    transport: createGrpcTransport({
      httpVersion: "2",
      baseUrl: config.dolosUtxorpcUrl,
      interceptors: config.dolosUtxorpcApiKey
        ? [
            (next) => async (req) => {
              req.header.set("dmtr-api-key", config.dolosUtxorpcApiKey!);
              return next(req);
            },
          ]
        : [],
    }),
  });
}
