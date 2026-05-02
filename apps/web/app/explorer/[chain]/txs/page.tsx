export const revalidate = 10;

import { Suspense } from "react";
import ChainSelector from "~/app/_components/ExplorerSection/ChainSelector";
import {
  BlockTxsSkeleton,
  TxSearch,
} from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { EXPLORER_BLOCK_PAGE_SIZE, EXPLORER_PAGE_SIZE } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { BlocksList } from "./BlocksList";
import DevnetTransactionsList from "./DevnetTransactionsList";
import next from "next";

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
    const tip = await provider.readTip();
    // +1 because it's not including tip currently
    const result = await provider.getBlocksWithTxs({ limit: EXPLORER_BLOCK_PAGE_SIZE, cursor: { height: tip.height - EXPLORER_BLOCK_PAGE_SIZE + 1n } });
    const oldestHeight = result.data.at(-1)!.block.height;
    const nextCursor = result.data.length === Number(EXPLORER_BLOCK_PAGE_SIZE.toString()) ? { height: oldestHeight - EXPLORER_BLOCK_PAGE_SIZE } : undefined;

    return (
      <BlocksList
        chain={chain}
        initialData={result.data}
        initialNextCursor={nextCursor}
      />
    );
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return (
      <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
        <p className="font-semibold">
          We&apos;re having trouble loading transactions
        </p>
        <p className="mt-2 text-sm">
          This is likely on our end. Please try again in a moment.
        </p>
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
        <div className="mb-6 flex w-full flex-col items-stretch gap-2 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <TxSearch chain={chain} />
          </div>
          <div className="shrink-0 md:min-w-[200px]">
            <ChainSelector currentChain={chain} />
          </div>
        </div>

        <Suspense
          fallback={<BlockTxsSkeleton rows={Number(EXPLORER_BLOCK_PAGE_SIZE)} />}
        >
          <TransactionsList chain={chain} />
        </Suspense>
      </main>
    </div>
  );
}
