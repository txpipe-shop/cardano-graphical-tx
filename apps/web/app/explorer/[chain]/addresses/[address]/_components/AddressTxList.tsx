import { type Address, type cardano } from "@laceanatomy/types";
import { cache } from "react";
import { ADDRESS_PAGE_SIZE, DEFAULT_DEVNET_PORT } from "~/app/_utils/constants";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";
import { AddressTxListClient } from "./AddressTxListClient";

interface AddressTxListProps {
  chain: Network;
  address: Address;
}

function resolveProvider(chain: Network) {
  if (chain === NETWORK.DEVNET) {
    return getU5CProviderNode(Number.parseInt(DEFAULT_DEVNET_PORT, 10));
  }
  return getDolosProvider(chain);
}

export const getAddressTxPage = cache(
  async ({
    chain,
    address,
  }: Readonly<Pick<AddressTxListProps, "chain" | "address">>) => {
    const provider = resolveProvider(chain);

    return provider.getTxs({
      query: { address },
      limit: ADDRESS_PAGE_SIZE + 1n,
      offset: 0n,
    });
  },
);

export async function AddressTxList({
  chain,
  address,
}: Readonly<AddressTxListProps>) {
  let allTxs: cardano.Tx[] = [];
  let hasMore = false;

  try {
    const response = await getAddressTxPage({ chain, address });
    allTxs = response.data;
    hasMore = allTxs.length > ADDRESS_PAGE_SIZE;
  } catch (err) {
    console.error(err);
  }

  const txs = allTxs.slice(0, Number(ADDRESS_PAGE_SIZE));

  return (
    <AddressTxListClient
      chain={chain}
      address={address}
      initialTxs={txs}
      hasMore={hasMore}
    />
  );
}
