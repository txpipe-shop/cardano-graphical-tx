import { type Address, type cardano } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { cache } from "react";
import { ADDRESS_PAGE_SIZE } from "~/app/_utils/constants";
import { AddressTxListClient } from "./AddressTxListClient";
import { resolveProvider } from "./resolve-provider";

interface AddressTxListProps {
  chain: Network;
  address: Address;
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
