"use server";

import { type Address } from "@laceanatomy/types";
import { DEFAULT_DEVNET_PORT } from "~/app/_utils/constants";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";

const PAGE_SIZE = 20n;

function resolveProvider(chain: Network) {
  if (chain === NETWORK.DEVNET) {
    return getU5CProviderNode(Number.parseInt(DEFAULT_DEVNET_PORT, 10));
  }
  return getDolosProvider(chain);
}

export async function loadMoreUTxOs(
  chain: Network,
  address: Address,
  offset: bigint,
) {
  const provider = resolveProvider(chain);
  return provider.getAddressUTxOs({
    query: { address },
    limit: PAGE_SIZE,
    offset,
  });
}

export async function loadMoreTxs(
  chain: Network,
  address: Address,
  offset: bigint,
) {
  const provider = resolveProvider(chain);
  return provider.getTxs({
    query: { address },
    limit: PAGE_SIZE,
    offset,
  });
}
