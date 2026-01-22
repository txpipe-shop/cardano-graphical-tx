import { Suspense } from "react";
import ChainSelector from "~/app/_components/ExplorerSection/ChainSelector";
import Pagination from "~/app/_components/ExplorerSection/Pagination";
import {
  TxSearch,
  TxTable,
} from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { ROUTES } from "~/app/_utils";
import Loading from "~/app/loading";
import {
  getDbSyncProvider,
  isValidChain,
  type ChainNetwork,
} from "~/server/api/dbsync-provider";

interface ExplorerPageProps {
  params: { chain: string };
  searchParams: { page?: string };
}

const PAGE_SIZE = 10n;

async function TransactionsList({
  chain,
  page,
}: {
  chain: ChainNetwork;
  page: number;
}) {
  try {
    const provider = getDbSyncProvider(chain);
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const offset = BigInt(currentPage - 1) * PAGE_SIZE;
    const result = await provider.getTxs({
      limit: PAGE_SIZE,
      offset,
      query: undefined,
    });

    const total = result.total ?? 0n;
    const totalPages = total === 0n ? 1 : Number((total - 1n) / PAGE_SIZE + 1n);

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
      <div className="rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-8 text-center text-red-600">
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
  const chainParam = params.chain || "mainnet";
  const chain: ChainNetwork = isValidChain(chainParam) ? chainParam : "mainnet";
  const pageParam = Number.parseInt(searchParams.page ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Transactions
          </h1>
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
