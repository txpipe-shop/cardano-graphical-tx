"use client";

import { type cardano } from "@laceanatomy/types";
import { useCallback, useRef, useState } from "react";
import InfiniteScrollTrigger from "~/app/_components/ExplorerSection/Pagination";
import { TxTable } from "~/app/_components/ExplorerSection/Transactions";
import { JSONBIG } from "~/app/_utils";
import { type Network } from "~/app/_utils/network-config";

interface InfiniteTransactionsListProps {
  chain: Network;
  initialTxs: cardano.Tx[];
  initialHasMore: boolean;
}

export default function InfiniteTransactionsList({
  chain,
  initialTxs,
  initialHasMore,
}: InfiniteTransactionsListProps) {
  const [transactions, setTransactions] = useState<cardano.Tx[]>(initialTxs);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const offsetRef = useRef(initialTxs.length);

  const loadMore = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/txs/${chain}?offset=${offsetRef.current}`);
      const json = JSONBIG.parse(await res.text()) as {
        data: cardano.Tx[];
        hasMore: boolean;
      };
      setTransactions((prev) => [...prev, ...json.data]);
      setHasMore(json.hasMore);
      offsetRef.current += json.data.length;
    } catch (error) {
      console.error("Failed to load more transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [chain]);

  return (
    <div className="space-y-4">
      <TxTable transactions={transactions} chain={chain} />
      <InfiniteScrollTrigger
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </div>
  );
}
