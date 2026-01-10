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

export default async function ExplorerPage({ searchParams }: ExplorerPageProps) {
  const params = await searchParams;
  const chainParam = params.chain || "mainnet";
  const chain: ChainNetwork = isValidChain(chainParam) ? chainParam : "mainnet";

  // TODO: Vector network doesn't have its own dbsync yet.
  // When vector is selected, we're actually querying mainnet data.
  // This should be fixed once Vector dbsync is available.
  const isVectorFallback = chainParam === "vector";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Transactions
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <TxSearch chain={chain} />
            <ChainSelector currentChain={chain} />
          </div>
        </div>

        {/* Vector Network Warning */}
        {isVectorFallback && (
          <div className="mb-4 rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
            <p className="font-semibold">⚠️ Vector Network Not Available</p>
            <p className="mt-1 text-sm">
              Vector network dbsync is not yet available. Showing Cardano
              Mainnet data as a fallback.
            </p>
          </div>
        )}

        {/* Transactions List */}
        <Suspense fallback={<LoadingState />}>
          <TransactionsList chain={chain} />
        </Suspense>
      </main>
    </div>
  );
}
