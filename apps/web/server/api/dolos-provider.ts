import { DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import { createGrpcTransport as createGrpcTransportNode } from "@laceanatomy/utxorpc-sdk/transport/node";
import { type Network } from "~/app/_utils/network-config";
import { getNetworkConfigServer } from "./server-network-config";

export function getDolosProvider(chain: Network): DolosProvider {
  const {
    dolosBlockfrostUrl,
    dolosBlockfrostApiKey,
    dolosUtxorpcUrl,
    dolosUtxorpcApiKey,
    addressPrefix,
  } = getNetworkConfigServer(chain);

  if (!dolosBlockfrostUrl) {
    throw new Error(`Dolos Blockfrost URL not configured for chain: ${chain}`);
  }
  if (!dolosUtxorpcUrl) {
    throw new Error(`Dolos UTxORPC URL not configured for chain: ${chain}`);
  }

  const transport = createGrpcTransportNode({
    httpVersion: "2",
    baseUrl: dolosUtxorpcUrl,
    interceptors: dolosUtxorpcApiKey
      ? [
          (next) => async (req) => {
            req.header.set("dmtr-api-key", dolosUtxorpcApiKey);
            return next(req);
          },
        ]
      : [],
  });

  return new DolosProvider({
    transport,
    blockfrostUrl: dolosBlockfrostUrl,
    blockfrostApiKey: dolosBlockfrostApiKey,
    addressPrefix,
  });
}

export function isDolosConfigured(chain: Network): boolean {
  const { dolosBlockfrostUrl, dolosUtxorpcUrl } = getNetworkConfigServer(chain);
  return Boolean(dolosBlockfrostUrl && dolosUtxorpcUrl);
}
