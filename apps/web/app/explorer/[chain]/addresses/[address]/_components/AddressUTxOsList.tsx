import { type Address, type cardano } from "@laceanatomy/types";
import { cache } from "react";
import { EmptyState } from "~/app/_components/EmptyState";
import { ADDRESS_PAGE_SIZE } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import { AddressUTxOsListClient } from "./AddressUTxOsListClient";
import { resolveProvider } from "./resolve-provider";

interface AddressUTxOsListProps {
  chain: Network;
  address: Address;
}

export const getAddressUTxOsPage = cache(
  async ({
    chain,
    address,
  }: Readonly<Pick<AddressUTxOsListProps, "chain" | "address">>) => {
    const provider = resolveProvider(chain);

    return provider.getAddressUTxOs({
      query: { address },
      limit: ADDRESS_PAGE_SIZE + 1n,
      offset: 0n,
    });
  },
);

export async function AddressUTxOsList({
  chain,
  address,
}: Readonly<AddressUTxOsListProps>) {
  let allUtxos: cardano.UTxO[] = [];
  let hasMore = false;

  try {
    const response = await getAddressUTxOsPage({ chain, address });
    allUtxos = response.data;
    hasMore = allUtxos.length > ADDRESS_PAGE_SIZE;
  } catch (err) {
    console.error(err);
  }

  const utxos = allUtxos.slice(0, Number(ADDRESS_PAGE_SIZE));

  if (utxos.length === 0) {
    return <EmptyState message="No UTxOs found for this address." />;
  }

  return (
    <AddressUTxOsListClient
      chain={chain}
      address={address}
      initialUtxos={utxos}
      hasMore={hasMore}
    />
  );
}
