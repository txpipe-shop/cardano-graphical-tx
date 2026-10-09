import { DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import { type Network } from "@laceanatomy/types/cardano";
import { env } from "~/app/env.mjs";
import { ByteLru } from "./cache";
import { withUpstreamCache } from "./cached-provider";
import { getNetworkConfigServer } from "./server-network-config";
import {
  UPSTREAM_CACHE_IMMUTABLE_BYTES,
  UPSTREAM_CACHE_MUTABLE_BYTES,
  UPSTREAM_CACHE_TTL_MS,
  UPSTREAM_HTTP_TIMEOUT_MS,
  memoize,
} from "./upstream";
import { getUtxoRpcTransport } from "./utxorpc-client";

const immutableCache = new ByteLru(UPSTREAM_CACHE_IMMUTABLE_BYTES);
const mutableCache = new ByteLru(UPSTREAM_CACHE_MUTABLE_BYTES);

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

  const provider = new DolosProvider({
    transport,
    blockfrostUrl: dolosBlockfrostUrl,
    blockfrostApiKey: dolosBlockfrostApiKey,
    httpTimeoutMs: UPSTREAM_HTTP_TIMEOUT_MS,
    addressPrefix,
    network: chain,
  });

  return withUpstreamCache(provider, {
    network: chain,
    immutable: immutableCache,
    mutable: mutableCache,
    ttlMs: UPSTREAM_CACHE_TTL_MS,
    onUpstream:
      env.UPSTREAM_REQUEST_LOG === "1"
        ? (key) => console.info(`upstream lookup ${key}`)
        : undefined,
  });
});

export function isDolosConfigured(chain: Network): boolean {
  const { dolosBlockfrostUrl, dolosUtxorpcUrl } = getNetworkConfigServer(chain);
  return Boolean(dolosBlockfrostUrl && dolosUtxorpcUrl);
}
