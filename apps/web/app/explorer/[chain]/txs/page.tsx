export const revalidate = 10;

import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DevnetError } from "~/app/_components/DevnetError";
import ChainSelector from "~/app/_components/ExplorerSection/ChainSelector";
import {
  BlockTxsSkeleton,
  TxSearch,
} from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { EXPLORER_PAGE_SIZE, getBlockPageSize, ROUTES } from "~/app/_utils";
import { createPageMetadata, formatChain } from "~/app/_utils/metadata";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { BlocksList } from "./BlocksList";
import DevnetTransactionsList from "./DevnetTransactionsList";

interface ExplorerPageProps {
  params: Promise<{ chain: Network }>;
}

export async function generateMetadata({
  params,
}: ExplorerPageProps): Promise<Metadata> {
  const { chain: chainParam } = await params;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const title = `${chainLabel} Transaction Explorer`;
  const description = `Explore recent Cardano ${chainLabel} blocks and transactions in Lace Anatomy.`;

  return createPageMetadata({
    title,
    description,
    path: ROUTES.EXPLORER_TXS(chain),
  });
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
    const pageSize = getBlockPageSize(chain);
    // +1 because it's not including tip currently
    const result = await provider.getBlocksWithTxs({
      limit: pageSize,
      cursor: { height: tip.height - pageSize + 1n },
    });
    const oldestHeight = result.data.at(-1)!.block.height;
    const nextCursor =
      result.data.length === Number(pageSize.toString())
        ? { height: oldestHeight - pageSize }
        : undefined;

    /* eslint-disable react-hooks/error-boundaries */
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
      <DevnetError
        title="We're having trouble loading transactions"
        error="This is likely on our end. Please try again in a moment."
      />
    );
  }
}

export default async function ExplorerTxsPage({ params }: ExplorerPageProps) {
  const { chain: chainParam } = await params;
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
          fallback={<BlockTxsSkeleton rows={Number(getBlockPageSize(chain))} />}
        >
          <TransactionsList chain={chain} />
        </Suspense>
      </main>
    </div>
  );
}
