import { Hash } from "@laceanatomy/types";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import TxTabs from "~/app/_components/ExplorerSection/Transactions/TxTabs";
import { Header } from "~/app/_components/Header";
import { TX_TABS, type TxTab } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import DevnetTxTabs from "./DevnetTxTabs";
import { loadPageData } from "./_utils";

interface Props {
  params: { chain: string; hash: string };
  searchParams?: { tab?: string };
}

function resolveTab(tab?: string): TxTab {
  if (!tab) return "Overview";
  const normalized = tab.toLowerCase();
  const match = TX_TABS.find(
    (candidate) => candidate.toLowerCase() === normalized,
  );
  return match ?? "Overview";
}

export default async function TxPage({ params, searchParams }: Props) {
  const hash = params.hash;
  const chainParam = params.chain || NETWORK.MAINNET;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const tabParam = searchParams?.tab;
  const tab = resolveTab(tabParam);

  if (chain === NETWORK.DEVNET) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="text-3xl font-extrabold text-p-primary">{hash}</h1>
            <div className="flex items-center gap-2">
              <CopyButton text={hash} size={16} />
            </div>
          </div>
          <div className="flex min-h-0 flex-1">
            <DevnetTxTabs hash={hash} tab={tab} />
          </div>
        </main>
      </div>
    );
  }

  if (chain === NETWORK.VECTOR) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-border p-8 text-center text-p-secondary">
            Coming soon...
          </div>
        </main>
      </div>
    );
  }

  try {
    const { cardanoTx, cbor, tx } = await loadPageData({
      chain,
      hash: Hash(hash),
    });
    return (
      <div className="flex min-h-screen flex-col bg-background">
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
              tab={tab}
              chain={chain}
            />
          </div>
        </main>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
            Transaction not found or could not be loaded.
          </div>
        </main>
      </div>
    );
  }
}
