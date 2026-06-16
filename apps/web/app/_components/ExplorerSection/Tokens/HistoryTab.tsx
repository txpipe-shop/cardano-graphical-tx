"use client";

import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import Link from "next/link";
import { useMemo } from "react";
import { ROUTES } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import type { AssetHistory } from "~/app/explorer/[chain]/tokens/[unit]/_shared";
import Pagination from "../Pagination";

const PAGE_SIZE = 30;

interface HistoryTabProps {
  history: AssetHistory[];
  chain: Network;
  page: number;
}

export default function HistoryTab({ history, chain, page }: HistoryTabProps) {
  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return history.slice(start, start + PAGE_SIZE);
  }, [history, currentPage]);

  if (history.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary">
        No history found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table aria-label="Token history" removeWrapper className="w-full">
        <TableHeader>
          <TableColumn>TX HASH</TableColumn>
          <TableColumn>ACTION</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
        </TableHeader>
        <TableBody>
          {paginated.map((entry, i) => (
            <TableRow key={`${entry.txHash}-${i}`}>
              <TableCell>
                <Link
                  href={ROUTES.EXPLORER_TX(chain, entry.txHash)}
                  className="font-mono text-xs text-accent-blue hover:underline"
                >
                  {entry.txHash.slice(0, 16)}...{entry.txHash.slice(-8)}
                </Link>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={entry.action === "minted" ? "success" : "danger"}
                >
                  {entry.action === "minted" ? "Mint" : "Burn"}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">{entry.amount}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {history.length > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath=""
        />
      )}
    </div>
  );
}
