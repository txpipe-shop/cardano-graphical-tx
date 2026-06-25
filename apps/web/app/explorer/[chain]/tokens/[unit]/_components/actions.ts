"use server";

import { type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";

const PAGE_SIZE = 20;

export async function loadMoreHistory(
  chain: Network,
  unit: string,
  page: number,
) {
  const provider = getDolosProvider(chain);
  const data = await provider.getAssetHistory(unit, PAGE_SIZE, page);
  return { data };
}
