import { NETWORK, type Network } from "@laceanatomy/types/cardano";
import { DEFAULT_DEVNET_PORT } from "~/app/_utils/constants";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";

export function resolveProvider(chain: Network) {
  if (chain === NETWORK.DEVNET) {
    return getU5CProviderNode(Number.parseInt(DEFAULT_DEVNET_PORT, 10));
  }
  return getDolosProvider(chain);
}
