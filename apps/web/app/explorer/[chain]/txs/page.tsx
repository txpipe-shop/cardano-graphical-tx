import { Card, CardBody } from "@heroui/react";
import Link from "next/link";
import { Suspense } from "react";
import ChainSelector from "~/app/_components/ExplorerSection/ChainSelector";
import { TxSearch } from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { EXPLORER_PAGE_SIZE, ROUTES } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import Loading from "~/app/loading";
import { getDolosProvider } from "~/server/api/dolos-provider";
import DevnetTransactionsList from "./DevnetTransactionsList";
import InfiniteTransactionsList from "./InfiniteTransactionsList";

interface ExplorerPageProps {
  params: { chain: string };
}

async function TransactionsList({ chain }: { chain: Network }) {
  if (chain === NETWORK.DEVNET) {
    return <DevnetTransactionsList chain={chain} />;
  }

  try {
    const provider = getDolosProvider(chain);
    const result = await provider.getTxs({
      limit: EXPLORER_PAGE_SIZE,
      offset: 0n,
      query: undefined,
    });

    return (
      <InfiniteTransactionsList
        chain={chain}
        initialTxs={result.data}
        initialHasMore={result.data.length === Number(EXPLORER_PAGE_SIZE)}
      />
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

        {chain === NETWORK.VECTOR ? (
          <Card className="w-full border-2 border-dashed border-border shadow-md bg-surface py-12">
            <CardBody className="py-8 text-center text-p-secondary">
              <p className="text-3xl font-semibold">Coming soon...</p>
              <p className="text-lg mt-2 font-medium">
                We&apos;re working on it!
                <br />
                In the meantime, you can explore{" "}
                <Link
                  className="text-blue-400 hover:underline"
                  href={ROUTES.EXPLORER_TXS(NETWORK.DEVNET)}
                >
                  devnet transactions
                </Link>
                .
              </p>
            </CardBody>
          </Card>
        ) : (
          <Suspense fallback={<Loading />}>
            <TransactionsList chain={chain} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
