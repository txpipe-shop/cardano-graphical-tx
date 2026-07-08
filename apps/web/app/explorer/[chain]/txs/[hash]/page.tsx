import { Hash } from "@laceanatomy/types";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import { DevnetError } from "~/app/_components/DevnetError";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import TxTabs from "~/app/_components/ExplorerSection/Transactions/TxTabs";
import { Header } from "~/app/_components/Header";
import { TX_TABS, type TxTab } from "~/app/_utils";
import DevnetTxTabs from "./DevnetTxTabs";
import { loadPageData } from "./_utils";

interface Props {
  params: Promise<{ chain: Network; hash: string }>;
  searchParams?: Promise<{ tab?: string }>;
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
  const { hash, chain: chainParam } = await params;
  const searchParamsAwaited = searchParams ? await searchParams : undefined;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const tabParam = searchParamsAwaited?.tab;
  const tab = resolveTab(tabParam);

  if (chain === NETWORK.DEVNET) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="break-all text-lg font-extrabold text-p-primary md:text-3xl">
              {hash}
            </h1>
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

  try {
    const { cardanoTx, cbor, tx } = await loadPageData({
      chain,
      hash: Hash(hash),
    });
    /* eslint-disable react-hooks/error-boundaries */
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="break-all text-lg font-extrabold md:text-3xl">
              {hash}
            </h1>
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
          <DevnetError title="Transaction not found or could not be loaded." />
        </main>
      </div>
    );
  }
}
