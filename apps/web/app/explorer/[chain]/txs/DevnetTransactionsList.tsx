"use client";

import { Card, CardBody } from "@heroui/react";
import { type cardano } from "@laceanatomy/types";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScrollTrigger from "~/app/_components/ExplorerSection/Pagination";
import { TxTable } from "~/app/_components/ExplorerSection/Transactions";
import { useConfigs } from "~/app/_contexts";
import {
  EXPLORER_PAGE_SIZE,
  getU5CProviderWeb,
  resolveDevnetPort,
} from "~/app/_utils";

interface DevnetTransactionsListProps {
  chain: string;
}

export default function DevnetTransactionsList({
  chain,
}: DevnetTransactionsListProps) {
  const { configs } = useConfigs();
  const [transactions, setTransactions] = useState<cardano.Tx[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(0);
  const port = resolveDevnetPort(configs.port);

  useEffect(() => {
    let isActive = true;

    const loadInitial = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        setTransactions([]);
        offsetRef.current = 0;

        const provider = getU5CProviderWeb(port);
        const result = await provider.getTxs({
          limit: EXPLORER_PAGE_SIZE,
          offset: 0n,
          query: undefined,
        });

        if (!isActive) return;

        setTransactions(result.data);
        setHasMore(result.data.length === Number(EXPLORER_PAGE_SIZE));
        offsetRef.current = result.data.length;
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        if (isActive) setInitialLoading(false);
      }
    };

    loadInitial();

    return () => {
      isActive = false;
    };
  }, [port]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const provider = getU5CProviderWeb(port);
      const result = await provider.getTxs({
        limit: EXPLORER_PAGE_SIZE,
        offset: BigInt(offsetRef.current),
        query: undefined,
      });

      setTransactions((prev) => [...prev, ...result.data]);
      setHasMore(result.data.length === Number(EXPLORER_PAGE_SIZE));
      offsetRef.current += result.data.length;
    } catch (err) {
      console.error("Failed to load more devnet transactions:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [port]);

  if (initialLoading) {
    return (
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          Loading devnet transactions...
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
        <p className="font-semibold">Failed to load devnet transactions</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TxTable transactions={transactions} chain={chain} />
      <InfiniteScrollTrigger
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={loadingMore}
      />
    </div>
  );
}
