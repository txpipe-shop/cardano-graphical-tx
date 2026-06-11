import { type Address } from "@laceanatomy/types";
import { cache } from "react";
import Pagination from "~/app/_components/ExplorerSection/Pagination";
import { UtxoList } from "~/app/_components/ExplorerSection/Transactions/TxOverview";
import { DEFAULT_DEVNET_PORT } from "~/app/_utils/constants";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";

const PAGE_SIZE = 20n;

interface AddressUTxOsListProps {
  chain: Network;
  address: Address;
  page: number;
  basePath: string;
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
    page,
  }: Readonly<Pick<AddressUTxOsListProps, "chain" | "address" | "page">>) => {
    const provider = resolveProvider(chain);
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const offset = BigInt(currentPage - 1) * PAGE_SIZE;

    return provider.getAddressUTxOs({
      query: { address },
      limit: PAGE_SIZE,
      offset,
    });
  },
);

export async function AddressUTxOsList({
  chain,
  address,
  page,
  basePath,
}: Readonly<AddressUTxOsListProps>) {
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;

  let utxos: Awaited<ReturnType<typeof getAddressUTxOsPage>>["data"] = [];
  let total = 0n;

  try {
    const response = await getAddressUTxOsPage({
      chain,
      address,
      page: currentPage,
    });
    utxos = response.data;
    total = response.total;
  } catch (err) {
    console.error(err);
  }

  if (total === 0n) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
        No UTxOs found for this address.
      </div>
    );
  }

  const totalPages = Number((total - 1n) / PAGE_SIZE + 1n);

  return (
    <div className="space-y-4">
      <UtxoList title={`UTxOs`} list={utxos} mint={{}} showAddress={false} />

      {total > PAGE_SIZE && (
        <Pagination
          basePath={basePath}
          currentPage={currentPage}
          totalPages={Math.max(totalPages, 1)}
        />
      )}
    </div>
  );
}
