import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import assert from "assert";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevnetError } from "~/app/_components/DevnetError";
import BlockTabs from "~/app/_components/ExplorerSection/Blocks/BlockTabs";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { Header } from "~/app/_components/Header";
import { BLOCK_TABS, ROUTES, type BlockTab } from "~/app/_utils";
import { resolveBlockReq } from "~/app/_utils/block";
import {
  createPageMetadata,
  formatAdaCompact,
  formatChain,
  truncateMiddle,
} from "~/app/_utils/metadata";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { isExplorerNotFound } from "../../../_utils/not-found";
import DevnetBlockTabs from "./DevnetBlockTabs";

interface Props {
  params: Promise<{ chain: Network; id: string }>;
  searchParams?: Promise<{ tab?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, chain: chainParam } = await params;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const blockReq = resolveBlockReq(id);
  const fallbackTitle = `Block ${truncateMiddle(id)} on ${chainLabel}`;
  const fallbackDescription = `Inspect Cardano ${chainLabel} block ${truncateMiddle(id)} in Lace Anatomy.`;
  const path = ROUTES.EXPLORER_BLOCK(chain, id);

  if (!blockReq) notFound();

  if (chain === NETWORK.DEVNET) {
    return createPageMetadata({
      title: fallbackTitle,
      description: fallbackDescription,
      path,
    });
  }

  try {
    const {
      data: [blockWithTxs],
    } = await getDolosProvider(chain).getBlocksWithTxs({
      cursor: blockReq,
      limit: 1n,
    });
    assert(blockWithTxs, "Block not found");
    const { block, transactions } = blockWithTxs;
    const title = `Block ${block.height.toString()} on ${chainLabel}`;
    const description = `${transactions.length} transactions, ${formatAdaCompact(block.fees)} total fees, slot ${block.slot.toString()}.`;

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

function resolveTab(tab?: string): BlockTab {
  if (!tab) return "Overview";
  const normalized = tab.toLowerCase();
  const match = BLOCK_TABS.find(
    (candidate) => candidate.toLowerCase() === normalized,
  );
  return match ?? "Overview";
}

export default async function BlockPage({ params, searchParams }: Props) {
  const { id, chain: chainParam } = await params;
  const searchParamsAwaited = searchParams ? await searchParams : undefined;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const tabParam = searchParamsAwaited?.tab;
  const tab = resolveTab(tabParam);
  const txPage = Math.max(1, Number(searchParamsAwaited?.page) || 1);

  const blockReq = resolveBlockReq(id);

  if (!blockReq) notFound();

  if (chain === NETWORK.DEVNET) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="break-all text-lg font-extrabold text-p-primary md:text-3xl">
              Block {id}
            </h1>
            <div className="flex items-center gap-2">
              <CopyButton text={id} size={16} />
            </div>
          </div>
          <div className="flex min-h-0 flex-1">
            <DevnetBlockTabs id={id} tab={tab} txPage={txPage} />
          </div>
        </main>
      </div>
    );
  }

  try {
    const provider = getDolosProvider(chain);
    const {
      data: [blockWithTxs],
    } = await provider.getBlocksWithTxs({ cursor: blockReq, limit: 1n });
    assert(blockWithTxs, "Block not found");
    const { block, transactions } = blockWithTxs;
    const cbor = provider.getBlockCBOR
      ? await provider.getBlockCBOR(blockReq)
      : null;

    /* eslint-disable react-hooks/error-boundaries */
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="break-all text-lg font-extrabold md:text-3xl">
              Block {block.height.toString()}
            </h1>
            <div className="flex items-center gap-2">
              <CopyButton text={block.hash} size={16} />
            </div>
          </div>
          <div className="flex min-h-0 flex-1">
            <BlockTabs
              block={block}
              transactions={transactions}
              cbor={cbor}
              chain={chain}
              tab={tab}
              txPage={txPage}
            />
          </div>
        </main>
      </div>
    );
    /* eslint-enable react-hooks/error-boundaries */
  } catch (err) {
    console.error(err);
    if (isExplorerNotFound(err)) notFound();

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <DevnetError title="Block not found or could not be loaded." />
        </main>
      </div>
    );
  }
}
