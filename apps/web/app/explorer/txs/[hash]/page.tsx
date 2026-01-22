import { Hash } from "@laceanatomy/types";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import TxTabs from "~/app/_components/ExplorerSection/Transactions/TxTabs";
import { Header } from "~/app/_components/Header";
import { type ChainNetwork, isValidChain } from "~/server/api/dbsync-provider";
import { loadPageData } from "./_utils";

interface Props {
  params: { hash: string };
  searchParams?: { chain?: string; datumTab?: string };
}

export default async function TxPage({ params, searchParams }: Props) {
  const hash = params.hash;
  const chainParam = (searchParams?.chain as string) || "mainnet";
  const chain: ChainNetwork = isValidChain(chainParam) ? chainParam : "mainnet";

  try {
    const { cardanoTx, cbor, tx } = await loadPageData({
      chain,
      hash: Hash(hash),
    });
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="text-3xl font-extrabold">{hash}</h1>
            <div className="flex items-center gap-2">
              <CopyButton text={hash} size={16} />
            </div>
          </div>
          <div className="flex min-h-0 flex-1">
            <TxTabs
              cardanoTx={cardanoTx}
              cbor={cbor}
              tx={tx}
              chain={chain}
              // TODO: load initialTab from URL
              tab="Overview"
            />
          </div>
        </main>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center text-gray-600">
            Transaction not found or could not be loaded.
          </div>
        </main>
      </div>
    );
  }
}
