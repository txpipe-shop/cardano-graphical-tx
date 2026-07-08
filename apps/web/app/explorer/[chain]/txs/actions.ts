"use server";

import type { BlockCursor } from "@laceanatomy/provider-core";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import { getBlockPageSize } from "~/app/_utils";
import { getDolosProvider } from "~/server/api/dolos-provider";

export async function loadMoreBlocks(chain: Network, cursor: BlockCursor) {
  const validChain: Network = isValidChain(chain) ? chain : NETWORK.MAINNET;
  const provider = getDolosProvider(validChain);
  return provider.getBlocksWithTxs({
    cursor,
    limit: getBlockPageSize(validChain),
  });
}
