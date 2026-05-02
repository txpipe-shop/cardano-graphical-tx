"use server";

import type { BlockCursor } from "@laceanatomy/provider-core";
import { EXPLORER_BLOCK_PAGE_SIZE } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";

export async function loadMoreBlocks(chain: string, cursor: BlockCursor) {
  const validChain: Network = isValidChain(chain) ? chain : NETWORK.MAINNET;
  const provider = getDolosProvider(validChain);
  return provider.getBlocksWithTxs({ cursor, limit: EXPLORER_BLOCK_PAGE_SIZE });
}
