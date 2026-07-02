"use client";

import { Button } from "@heroui/react";
import { type cardano } from "@laceanatomy/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { type Network } from "~/app/_utils/network-config";
import { loadMoreTransactions } from "~/app/explorer/[chain]/tokens/[unit]/_components/actions";
import { TxTable } from "../Transactions/TxTable";

interface TransactionsTabProps {
  transactions: cardano.Tx[];
  chain: Network;
  unit: string;
  hasMoreTransactions: boolean;
}

export default function TransactionsTab({
  transactions: initialTransactions,
  chain,
  unit,
  hasMoreTransactions: initialHasMore,
}: TransactionsTabProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);

  const onLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await loadMoreTransactions(chain, unit, currentPage);
      setTransactions((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setCurrentPage((prev) => prev + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <TxTable transactions={transactions} chain={chain} />
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onPress={onLoadMore}
            isLoading={loading}
            variant="flat"
            aria-busy={loading}
            className="bg-explorer-row text-p-secondary shadow-sm"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
