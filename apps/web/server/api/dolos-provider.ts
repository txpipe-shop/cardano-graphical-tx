import { DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import { type Network } from "@laceanatomy/types/cardano";
import { getNetworkConfigServer } from "./server-network-config";
import { UPSTREAM_HTTP_TIMEOUT_MS, memoize } from "./upstream";
import { getUtxoRpcTransport } from "./utxorpc-client";

export const getDolosProvider = memoize((chain: Network): DolosProvider => {
  const { dolosBlockfrostUrl, dolosBlockfrostApiKey, addressPrefix } =
    getNetworkConfigServer(chain);

  if (!dolosBlockfrostUrl) {
    throw new Error(`Dolos Blockfrost URL not configured for chain: ${chain}`);
  }
  const transport = getUtxoRpcTransport(chain);
  if (!transport) {
    throw new Error(`Dolos UTxORPC URL not configured for chain: ${chain}`);
  }

  return new DolosProvider({
    transport,
    blockfrostUrl: dolosBlockfrostUrl,
    blockfrostApiKey: dolosBlockfrostApiKey,
    httpTimeoutMs: UPSTREAM_HTTP_TIMEOUT_MS,
    addressPrefix,
    network: chain,
  });
});

export function isDolosConfigured(chain: Network): boolean {
  const { dolosBlockfrostUrl, dolosUtxorpcUrl } = getNetworkConfigServer(chain);
  return Boolean(dolosBlockfrostUrl && dolosUtxorpcUrl);
}
