"use server";

import type { cardano } from "@laceanatomy/types";
import { Hash } from "@laceanatomy/types";
import { type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";

const HISTORY_PAGE_SIZE = 20;
const TX_PAGE_SIZE = 5;
const TX_FETCH_SIZE = TX_PAGE_SIZE + 1;

export async function loadMoreHistory(
  chain: Network,
  unit: string,
  page: number,
) {
  const provider = getDolosProvider(chain);
  const data = await provider.getAssetHistory(unit, HISTORY_PAGE_SIZE, page);
  return { data };
}

export async function loadMoreTransactions(
  chain: Network,
  unit: string,
  page: number,
): Promise<{ data: cardano.Tx[]; hasMore: boolean }> {
  const provider = getDolosProvider(chain);
  const rawTxs = await provider.getAssetTransactions(
    unit,
    TX_FETCH_SIZE,
    page,
    "desc",
  );
  const hasMore = rawTxs.length > TX_PAGE_SIZE;
  const hashesToFetch = rawTxs.slice(0, TX_PAGE_SIZE).map((t) => t.txHash);

  const results = await Promise.allSettled(
    hashesToFetch.map((hash) => provider.getTx({ hash: Hash(hash) })),
  );
  const txs = results
    .filter(
      (r): r is PromiseFulfilledResult<cardano.Tx> => r.status === "fulfilled",
    )
    .map((r) => r.value);

  return { data: txs, hasMore };
}
