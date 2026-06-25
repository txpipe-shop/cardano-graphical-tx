import { type Address, type cardano } from "@laceanatomy/types";
import { cache } from "react";
import { ADDRESS_PAGE_SIZE, DEFAULT_DEVNET_PORT } from "~/app/_utils/constants";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";
import { AddressUTxOsListClient } from "./AddressUTxOsListClient";

interface AddressUTxOsListProps {
  chain: Network;
  address: Address;
}

function resolveProvider(chain: Network) {
  if (chain === NETWORK.DEVNET) {
    return getU5CProviderNode(Number.parseInt(DEFAULT_DEVNET_PORT, 10));
  }
  return getDolosProvider(chain);
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
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
        No UTxOs found for this address.
      </div>
    );
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
