"use server";

import type { cardano } from "@laceanatomy/types";
import { Hash } from "@laceanatomy/types";
import { type Network, isValidChain } from "@laceanatomy/types/cardano";
import {
  HISTORY_PAGE_SIZE,
  TX_PAGE_SIZE,
} from "~/app/_components/ExplorerSection/Tokens/constants";
import { getDolosProvider } from "~/server/api/dolos-provider";

const TX_FETCH_SIZE = TX_PAGE_SIZE + 1;

export async function loadMoreHistory(
  chain: Network,
  unit: string,
  page: number,
) {
  if (!isValidChain(chain)) {
    throw new Error(`Invalid chain: ${chain}`);
  }
  const provider = getDolosProvider(chain);
  const data = await provider.getAssetHistory(unit, HISTORY_PAGE_SIZE, page);
  return { data };
}

export async function loadMoreTransactions(
  chain: Network,
  unit: string,
  page: number,
): Promise<{ data: cardano.Tx[]; hasMore: boolean }> {
  if (!isValidChain(chain)) {
    throw new Error(`Invalid chain: ${chain}`);
  }
  const provider = getDolosProvider(chain);
  const rawTxs = await provider.getAssetTxs(unit, TX_FETCH_SIZE, page, "desc");
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
