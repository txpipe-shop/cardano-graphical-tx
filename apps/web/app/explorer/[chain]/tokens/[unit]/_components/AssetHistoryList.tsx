import { type Network } from "@laceanatomy/types/cardano";
import { cache } from "react";
import { EmptyState } from "~/app/_components/EmptyState";
import { HOLDERS_PAGE_SIZE as PAGE_SIZE } from "~/app/_components/ExplorerSection/Tokens/constants";
import { isExplorerNotFound } from "~/app/explorer/_utils/not-found";
import { getDolosProvider } from "~/server/api/dolos-provider";
import type { AssetHistory } from "../_shared";
import { AssetHistoryListClient } from "./AssetHistoryListClient";

const FETCH_SIZE = PAGE_SIZE + 1;

interface AssetHistoryListProps {
  chain: Network;
  unit: string;
}

export const getAssetHistoryPage = cache(
  async (chain: Network, unit: string) => {
    const provider = getDolosProvider(chain);
    return provider.getAssetHistory(unit, FETCH_SIZE, 1);
  },
);

export async function AssetHistoryList({
  chain,
  unit,
}: Readonly<AssetHistoryListProps>) {
  let allHistory: AssetHistory[] = [];
  let hasMore = false;

  try {
    allHistory = await getAssetHistoryPage(chain, unit);
    hasMore = allHistory.length > PAGE_SIZE;
  } catch (err) {
    // Dolos minibf has no /assets/{unit}/history route, so a 404 is expected.
    if (!isExplorerNotFound(err)) console.error(err);
  }

  const history = allHistory.slice(0, PAGE_SIZE);

  if (history.length === 0) {
    return <EmptyState message="No history found." />;
  }

  return (
    <AssetHistoryListClient
      chain={chain}
      unit={unit}
      initialHistory={history}
      hasMore={hasMore}
    />
  );
}
