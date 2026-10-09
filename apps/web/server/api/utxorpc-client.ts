import { type Network } from "@laceanatomy/types/cardano";
import { UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";
import { getNetworkConfigServer } from "./server-network-config";
import { createUpstreamTransport, memoize } from "./upstream";

/** The network's Dolos UTxORPC transport, shared by every client of it. */
export const getUtxoRpcTransport = memoize((network: Network) => {
  const { dolosUtxorpcUrl, dolosUtxorpcApiKey } =
    getNetworkConfigServer(network);
  if (!dolosUtxorpcUrl) return null;

  return createUpstreamTransport(
    dolosUtxorpcUrl,
    dolosUtxorpcApiKey ? { "dmtr-api-key": dolosUtxorpcApiKey } : undefined,
  );
});

export const getUtxoRpcClient = memoize((network: Network) => {
  const transport = getUtxoRpcTransport(network);
  return transport ? new UtxoRpcClient({ transport }) : null;
});
