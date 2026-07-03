"use client";

import { type cardano } from "@laceanatomy/types";
import { useEffect, useMemo, useState } from "react";
import { DevnetError } from "~/app/_components/DevnetError";
import { DevnetLoadingCard } from "~/app/_components/DevnetLoadingCard";
import Pagination from "~/app/_components/ExplorerSection/Pagination";
import { TxTable } from "~/app/_components/ExplorerSection/Transactions";
import { useConfigs } from "~/app/_contexts";
import { type Network, NETWORK, resolveDevnetPort, ROUTES } from "~/app/_utils";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";

interface DevnetTransactionsListProps {
  chain: Network;
  page: number;
  pageSize: number;
}

export default function DevnetTransactionsList({
  chain,
  page,
  pageSize,
}: DevnetTransactionsListProps) {
  const { configs } = useConfigs();
  const [transactions, setTransactions] = useState<cardano.Tx[]>([]);
  const [total, setTotal] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const port = resolveDevnetPort(configs.port);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const provider = getU5CProviderWeb(port);
        const limit = BigInt(pageSize);
        const offset = BigInt(currentPage - 1) * BigInt(pageSize);

        const result = await provider.getTxs({
          limit,
          offset,
          query: undefined,
        });

        if (!isActive) return;

        setTransactions(result.data);
        setTotal(result.total ?? 0n);
      } catch (err) {
        if (!isActive) return;
        console.error("Failed to fetch devnet transactions:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [currentPage, pageSize, port]);

  const totalPages = useMemo(() => {
    if (total && total > 0n) {
      return Number((total - 1n) / BigInt(pageSize) + 1n);
    }

    if (transactions.length === pageSize) {
      return currentPage + 1;
    }

    return Math.max(currentPage, 1);
  }, [currentPage, pageSize, total, transactions.length]);

  if (loading) {
    return <DevnetLoadingCard message="Loading devnet transactions..." />;
  }

  if (error) {
    return (
      <DevnetError title="Failed to load devnet transactions" error={error} />
    );
  }

  return (
    <div className="space-y-4">
      <TxTable transactions={transactions} chain={chain} />
      <Pagination
        basePath={ROUTES.EXPLORER_TXS(NETWORK.DEVNET)}
        currentPage={currentPage}
        totalPages={Math.max(totalPages, 1)}
      />
    </div>
  );
}
