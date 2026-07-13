import { Hash } from "@laceanatomy/types";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevnetError } from "~/app/_components/DevnetError";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import TxTabs from "~/app/_components/ExplorerSection/Transactions/TxTabs";
import { Header } from "~/app/_components/Header";
import { ROUTES, TX_TABS, type TxTab } from "~/app/_utils";
import {
  createPageMetadata,
  formatAdaCompact,
  formatChain,
  truncateMiddle,
} from "~/app/_utils/metadata";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { isExplorerNotFound } from "../../../_utils/not-found";
import DevnetTxTabs from "./DevnetTxTabs";
import { loadPageData } from "./_utils";

interface Props {
  params: Promise<{ chain: Network; hash: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hash, chain: chainParam } = await params;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const shortHash = truncateMiddle(hash);
  const fallbackTitle = `Transaction ${shortHash} on ${chainLabel}`;
  const fallbackDescription = `Inspect Cardano ${chainLabel} transaction ${shortHash} in Lace Anatomy.`;
  const path = ROUTES.EXPLORER_TX(chain, hash);

  if (chain === NETWORK.DEVNET) {
    return createPageMetadata({
      title: fallbackTitle,
      description: fallbackDescription,
      path,
    });
  }

  try {
    const tx = await getDolosProvider(chain).getTx({ hash: Hash(hash) });
    const title = `Transaction ${shortHash} on ${chainLabel}`;
    const description = `Block ${tx.block.height.toString()} transaction with ${tx.inputs.length} inputs, ${tx.outputs.length} outputs, and ${formatAdaCompact(tx.fee)} fee.`;

    return createPageMetadata({
      title,
      description,
      path,
    });
  } catch (err) {
    console.error(err);
    if (isExplorerNotFound(err)) notFound();

    return createPageMetadata({
      title: fallbackTitle,
      description: fallbackDescription,
      path,
    });
  }
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
    if (isExplorerNotFound(err)) notFound();

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
