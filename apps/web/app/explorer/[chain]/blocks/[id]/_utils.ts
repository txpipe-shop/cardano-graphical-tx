import { type Network } from "@laceanatomy/types/cardano";
import assert from "assert";
import { cache } from "react";
import { resolveBlockReq } from "~/app/_utils/block";
import { getDolosProvider } from "~/server/api/dolos-provider";

function requireBlockReq(id: string) {
  const blockReq = resolveBlockReq(id);
  assert(blockReq, "Invalid block identifier");
  return blockReq;
}

export const getBlockWithTxs = cache(async (chain: Network, id: string) => {
  const {
    data: [blockWithTxs],
  } = await getDolosProvider(chain).getBlocksWithTxs({
    cursor: requireBlockReq(id),
    limit: 1n,
  });
  assert(blockWithTxs, "Block not found");
  return blockWithTxs;
});
