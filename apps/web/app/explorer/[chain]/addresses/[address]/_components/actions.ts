"use server";

import { type Address } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { ADDRESS_PAGE_SIZE } from "~/app/_utils/constants";
import { resolveProvider } from "./resolve-provider";

export async function loadMoreUTxOs(
  chain: Network,
  address: Address,
  offset: bigint,
) {
  const provider = resolveProvider(chain);
  return provider.getAddressUTxOs({
    query: { address },
    limit: ADDRESS_PAGE_SIZE + 1n,
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
    limit: ADDRESS_PAGE_SIZE + 1n,
    offset,
  });
}
