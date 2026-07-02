import { Unit } from "@laceanatomy/types";
import { Suspense } from "react";
import TokenTabs from "~/app/_components/ExplorerSection/Tokens/TokenTabs";
import { Header } from "~/app/_components/Header";
import { TOKEN_TABS, type TokenTab } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { AssetHistoryList } from "./_components/AssetHistoryList";
import { loadTokenPageData } from "./_shared";
import DevnetTokenTabs from "./DevnetTokenTabs";

interface Props {
  params: Promise<{ chain: Network; unit: Unit }>;
  searchParams?: Promise<{ tab?: string; page?: string }>;
}

function resolveTab(tab?: string): TokenTab {
  if (!tab) return "Holders";
  const normalized = tab.toLowerCase();
  const match = TOKEN_TABS.find(
    (candidate) => candidate.toLowerCase() === normalized,
  );
  return match ?? "Holders";
}

async function loadData(chain: Network, unit: Unit, page: number = 1) {
  try {
    const provider = getDolosProvider(chain);
    const data = await loadTokenPageData(provider, unit, chain, page);
    return { data, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: true };
  }
}

export default async function TokenPage({ params, searchParams }: Props) {
  const { unit, chain: chainParam } = await params;
  const searchParamsAwaited = searchParams ? await searchParams : undefined;
  const chain = isValidChain(chainParam) ? chainParam : NETWORK.MAINNET;
  const tabParam = searchParamsAwaited?.tab;
  const tab = resolveTab(tabParam);
  const page = Math.max(
    1,
    Number.parseInt(searchParamsAwaited?.page || "1", 10) || 1,
  );

  if (chain === NETWORK.DEVNET) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary-action focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
          <div className="flex min-h-0 flex-1">
            <DevnetTokenTabs unit={unit} tab={tab} page={page} />
          </div>
        </main>
      </div>
    );
  }

  const { data, error } = await loadData(chain, unit, page);

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary-action focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div
            role="alert"
            className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2"
          >
            Token not found or could not be loaded.
          </div>
        </main>
      </div>
    );
  }

  const historyContent = (
    <Suspense
      fallback={
        <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
          Loading history...
        </div>
      }
    >
      <AssetHistoryList chain={chain} unit={data.assetInfo.unit} />
    </Suspense>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary-action focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
        <div className="flex min-h-0 flex-1">
          <TokenTabs
            data={data}
            tab={tab}
            chain={chain}
            page={page}
            historyContent={historyContent}
          />
        </div>
      </main>
    </div>
  );
}
