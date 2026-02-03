import { Suspense } from "react";
import ChainSelector from "~/app/_components/ExplorerSection/ChainSelector";
import Pagination from "~/app/_components/ExplorerSection/Pagination";
import {
  TxSearch,
  TxTable,
} from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { EXPLORER_PAGE_SIZE, ROUTES } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import Loading from "~/app/loading";
import { getDbSyncProvider } from "~/server/api/dbsync-provider";
import DevnetTransactionsList from "./DevnetTransactionsList";

interface ExplorerPageProps {
  params: { chain: string };
  searchParams: { page?: string };
}

async function TransactionsList({
  chain,
  page,
}: {
  chain: Network;
  page: number;
}) {
  if (chain === NETWORK.DEVNET) {
    return (
      <DevnetTransactionsList
        chain={chain}
        page={page}
        pageSize={Number(EXPLORER_PAGE_SIZE)}
      />
    );
  }

  try {
    const provider = getDbSyncProvider(chain);
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const offset = BigInt(currentPage - 1) * EXPLORER_PAGE_SIZE;
    const result = await provider.getTxs({
      limit: EXPLORER_PAGE_SIZE,
      offset,
      query: undefined,
    });

    const total = result.total ?? 0n;
    const totalPages =
      total === 0n ? 1 : Number((total - 1n) / EXPLORER_PAGE_SIZE + 1n);

    return (
      <div className="space-y-4">
        <TxTable transactions={result.data} chain={chain} />
        <Pagination
          basePath={ROUTES.EXPLORER_TXS(chain)}
          currentPage={currentPage}
          totalPages={Math.max(totalPages, 1)}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return (
      <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
        <p className="font-semibold">Failed to load transactions</p>
        <p className="mt-2 text-sm">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }
}

export default async function ExplorerTxsPage({
  params,
  searchParams,
}: ExplorerPageProps) {
  const chainParam = params.chain || NETWORK.MAINNET;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const pageParam = Number.parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="container mx-auto px-4 py-6 bg-surface">
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold text-p-primary">Explorer</h1>
          <div className="flex w-full gap-2">
            <div className="min-w-0 flex-1">
              <TxSearch chain={chain} />
            </div>
            <div className="min-w-[200px] shrink-0">
              <ChainSelector currentChain={chain} />
            </div>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <TransactionsList chain={chain} page={page} />
        </Suspense>
      </main>
    </div>
  );
}
