'use server';

import { type Network } from '~/app/_utils/network-config';
import { getDolosProvider } from '~/server/api/dolos-provider';
import type { AssetAddress } from '~/app/explorer/[chain]/tokens/[unit]/_shared';

const PAGE_SIZE = 20;

export async function loadMoreHolders(chain: Network, unit: string, page: number) {
  const provider = getDolosProvider(chain);
  const data = await provider.getAssetAddresses(unit, PAGE_SIZE, page);
  return { data: data as AssetAddress[] };
}
