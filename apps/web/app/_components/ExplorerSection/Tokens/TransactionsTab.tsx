"use client";

import { type cardano } from "@laceanatomy/types";
import { useMemo } from "react";
import { Network } from "~/app/_utils";
import Pagination from "../Pagination";
import { TxTable } from "../Transactions/TxTable";

const PAGE_SIZE = 30;

interface TransactionsTabProps {
  transactions: cardano.Tx[];
  chain: Network;
  page: number;
}

export default function TransactionsTab({
  transactions,
  chain,
  page,
}: TransactionsTabProps) {
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, currentPage]);

  return (
    <div className="space-y-4">
      <TxTable transactions={paginated} chain={chain} />
      {transactions.length > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath=""
        />
      )}
    </div>
  );
}
