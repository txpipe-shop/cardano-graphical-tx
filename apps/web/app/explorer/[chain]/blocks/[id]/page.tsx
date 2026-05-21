import { Hash } from "@laceanatomy/types";
import assert from "assert";
import BlockTabs from "~/app/_components/ExplorerSection/Blocks/BlockTabs";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { Header } from "~/app/_components/Header";
import { BLOCK_TABS, type BlockTab } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import DevnetBlockTabs from "./DevnetBlockTabs";

interface Props {
  params: Promise<{ chain: string; id: string }>;
  searchParams?: Promise<{ tab?: string; page?: string }>;
}

function resolveTab(tab?: string): BlockTab {
  if (!tab) return "Overview";
  const normalized = tab.toLowerCase();
  const match = BLOCK_TABS.find(
    (candidate) => candidate.toLowerCase() === normalized,
  );
  return match ?? "Overview";
}

function resolveBlockReq(
  id: string,
): { hash: Hash } | { height: bigint } | null {
  if (/^[0-9a-fA-F]{64}$/.test(id)) {
    return { hash: Hash(id) };
  }
  if (/^\d+$/.test(id)) {
    return { height: BigInt(id) };
  }
  return null;
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

  if (!blockReq) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
            Invalid block identifier.
          </div>
        </main>
      </div>
    );
  }

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
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
            Block not found or could not be loaded.
          </div>
        </main>
      </div>
    );
  }
}
