"use client";

import { Card, CardBody } from "@heroui/react";
import { type cardano } from "@laceanatomy/types";
import { useMemo } from "react";
import { Network } from "~/app/_utils";
import Pagination from "../Pagination";
import { TxTable } from "../Transactions/TxTable";

interface BlockTransactionsProps {
  transactions: cardano.Tx[];
  chain: Network;
  page: number;
}

const PAGE_SIZE = 20;

export default function BlockTransactions({
  transactions,
  chain,
  page,
}: BlockTransactionsProps) {
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, currentPage]);

  if (transactions.length === 0) {
    return (
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          This block contains no transactions.
        </CardBody>
      </Card>
    );
  }

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
