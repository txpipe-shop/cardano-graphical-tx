import { DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import { createGrpcTransport as createGrpcTransportNode } from "@laceanatomy/utxorpc-sdk/transport/node";
import { getAddressPrefix, type Network } from "~/app/_utils/network-config";
import { getNetworkConfigServer } from "./server-network-config";

export function getDolosProvider(chain: Network): DolosProvider {
  const { dolosUtxorpcUrl, dolosMinibfUrl } = getNetworkConfigServer(chain);

  if (!dolosUtxorpcUrl || !dolosMinibfUrl) {
    throw new Error(`Dolos not configured for chain: ${chain}`);
  }

  return new DolosProvider({
    transport: createGrpcTransportNode({
      httpVersion: "2",
      baseUrl: dolosUtxorpcUrl,
    }),
    minibfUrl: dolosMinibfUrl,
    addressPrefix: getAddressPrefix(chain),
  });
}
