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
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold">{hash}</h1>
            <div className="flex items-center gap-2">
              <CopyButton text={hash} size={16} />
            </div>
          </div>
          <TxTabs
            cardanoTx={cardanoTx}
            cbor={cbor}
            tx={tx}
            chain={chain}
            // TODO: load initialTab from URL
            tab="Overview"
          />
        </main>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center text-gray-600">
            Transaction not found or could not be loaded.
          </div>
        </main>
      </div>
    );
  }
}
