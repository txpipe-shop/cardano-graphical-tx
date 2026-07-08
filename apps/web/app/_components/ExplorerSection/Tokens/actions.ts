"use server";

import { isValidChain, type Network } from "@laceanatomy/types/cardano";
import type { AssetAddress } from "~/app/explorer/[chain]/tokens/[unit]/_shared";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { HOLDERS_PAGE_SIZE } from "./constants";

export async function loadMoreHolders(
  chain: Network,
  unit: string,
  page: number,
) {
  if (!isValidChain(chain)) {
    throw new Error(`Invalid chain: ${chain}`);
  }
  const provider = getDolosProvider(chain);
  const data = await provider.getAssetHolders(unit, HOLDERS_PAGE_SIZE, page);
  return { data: data as AssetAddress[] };
}
