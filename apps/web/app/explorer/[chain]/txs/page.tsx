export const revalidate = 10;

import { Suspense } from "react";
import ChainSelector from "~/app/_components/ExplorerSection/ChainSelector";
import {
  TxSearch,
  TxTable,
} from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { EXPLORER_PAGE_SIZE } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import Loading from "~/app/loading";
import { getDolosProvider } from "~/server/api/dolos-provider";
import DevnetTransactionsList from "./DevnetTransactionsList";

interface ExplorerPageProps {
  params: { chain: string };
}

async function TransactionsList({ chain }: { chain: Network }) {
  if (chain === NETWORK.DEVNET) {
    return (
      <DevnetTransactionsList
        chain={chain}
        page={1}
        pageSize={Number(EXPLORER_PAGE_SIZE)}
      />
    );
  }

  try {
    const provider = getDolosProvider(chain);
    const result = await provider.getTxs({
      limit: EXPLORER_PAGE_SIZE,
      offset: 0n,
      query: undefined,
    });

    return <TxTable transactions={result.data} chain={chain} />;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return (
      <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
        <p className="font-semibold">We&apos;re having trouble loading transactions</p>
        <p className="mt-2 text-sm">This is likely on our end. Please try again in a moment.</p>
      </div>
    );
  }
}

export default async function ExplorerTxsPage({ params }: ExplorerPageProps) {
  const chainParam = params.chain || NETWORK.MAINNET;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;

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
          <TransactionsList chain={chain} />
        </Suspense>
      </main>
    </div>
  );
}
