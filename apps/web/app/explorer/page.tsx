import { Suspense } from "react";
import { Header } from "~/app/_components/Header";
import {
  getDbSyncProvider,
  isValidChain,
  type ChainNetwork,
} from "~/server/api/dbsync-provider";
import { ChainSelector, TxSearch, TxTable } from "./_components";

interface ExplorerPageProps {
  searchParams: Promise<{ chain?: string }>;
}

async function TransactionsList({ chain }: { chain: ChainNetwork }) {
  try {
    const provider = getDbSyncProvider(chain);
    const result = await provider.getTxs({
      limit: 50n,
      query: undefined,
    });

    return <TxTable transactions={result.data} chain={chain} />;
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

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-8 shadow-md">
      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-violet-600" />
      <span className="text-gray-500">Loading transactions...</span>
    </div>
  );
}

export default async function ExplorerPage({
  searchParams,
}: ExplorerPageProps) {
  const params = await searchParams;
  const chainParam = params.chain || "mainnet";
  const chain: ChainNetwork = isValidChain(chainParam) ? chainParam : "mainnet";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
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

        {/* Transactions List */}
        <Suspense fallback={<LoadingState />}>
          <TransactionsList chain={chain} />
        </Suspense>
      </main>
    </div>
  );
}
