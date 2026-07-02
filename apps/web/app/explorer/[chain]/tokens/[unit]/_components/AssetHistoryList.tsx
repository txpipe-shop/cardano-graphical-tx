import { cache } from "react";
import { type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { HOLDERS_PAGE_SIZE as PAGE_SIZE } from "~/app/_components/ExplorerSection/Tokens/constants";
import type { AssetHistory } from "../_shared";
import { AssetHistoryListClient } from "./AssetHistoryListClient";

const FETCH_SIZE = PAGE_SIZE + 1;

interface AssetHistoryListProps {
  chain: Network;
  unit: string;
}

export const getAssetHistoryPage = cache(
  async ({ chain, unit }: Readonly<AssetHistoryListProps>) => {
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
    allHistory = await getAssetHistoryPage({ chain, unit });
    hasMore = allHistory.length > PAGE_SIZE;
  } catch (err) {
    console.error(err);
  }

  const history = allHistory.slice(0, PAGE_SIZE);

  if (history.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
        No history found.
      </div>
    );
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
