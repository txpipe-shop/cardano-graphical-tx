import type { Unit } from "@laceanatomy/types";
import { Suspense } from "react";
import { DevnetError } from "~/app/_components/DevnetError";
import { EmptyState } from "~/app/_components/EmptyState";
import TokenTabs from "~/app/_components/ExplorerSection/Tokens/TokenTabs";
import { TOKEN_TABS, type TokenTab } from "~/app/_utils";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { AssetHistoryList } from "./_components/AssetHistoryList";
import { TokenPageLayout } from "./_components/TokenPageLayout";
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
      <TokenPageLayout>
        <DevnetTokenTabs unit={unit} tab={tab} />
      </TokenPageLayout>
    );
  }

  const { data, error } = await loadData(chain, unit, page);

  if (error || !data) {
    return (
      <TokenPageLayout>
        <DevnetError title="Token not found or could not be loaded." />
      </TokenPageLayout>
    );
  }

  const historyContent = (
    <Suspense fallback={<EmptyState message="Loading history..." />}>
      <AssetHistoryList chain={chain} unit={data.assetInfo.unit} />
    </Suspense>
  );

  return (
    <TokenPageLayout>
      <TokenTabs
        data={data}
        tab={tab}
        chain={chain}
        historyContent={historyContent}
      />
    </TokenPageLayout>
  );
}
