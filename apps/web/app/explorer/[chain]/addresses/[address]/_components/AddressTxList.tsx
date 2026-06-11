import { type Address } from "@laceanatomy/types";
import { cache } from "react";
import Pagination from "~/app/_components/ExplorerSection/Pagination";
import { TxTable } from "~/app/_components/ExplorerSection/Transactions";
import { DEFAULT_DEVNET_PORT } from "~/app/_utils/constants";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";

const PAGE_SIZE = 20n;

interface AddressTxListProps {
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

export const getAddressTxPage = cache(async ({
  chain,
  address,
  page,
}: Readonly<Pick<AddressTxListProps, "chain" | "address" | "page">>) => {
  const provider = resolveProvider(chain);
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const offset = BigInt(currentPage - 1) * PAGE_SIZE;

  return provider.getTxs({
    query: { address },
    limit: PAGE_SIZE,
    offset,
  });
});

export async function AddressTxList({
  chain,
  address,
  page,
  basePath,
}: Readonly<AddressTxListProps>) {
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  let txs: Awaited<ReturnType<typeof getAddressTxPage>>["data"] = [];
  let total = 0n;

  try {
    const response = await getAddressTxPage({ chain, address, page: currentPage });
    txs = response.data;
    total = response.total;
  } catch (err) {
    console.error(err);
  }

  const totalPages = Number((total - 1n) / PAGE_SIZE + 1n);

  return (
    <div className="space-y-4">
      <TxTable transactions={txs} chain={chain} highlightAddress={address} />

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
