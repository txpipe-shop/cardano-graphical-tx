"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import Link from "next/link";
import { useMemo } from "react";
import { ROUTES } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import type { AssetHistory } from "~/app/explorer/[chain]/tokens/[unit]/_shared";
import CopyButton from "../CopyButton";
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
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          No history found.
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 bg-explorer-row px-4 py-2 md:flex-row md:items-center md:justify-between md:gap-4">
        <span className="text-xs font-medium text-p-secondary">TX HASH</span>
        <span className="text-xs font-medium text-p-secondary">ACTION</span>
        <span className="text-xs font-medium text-p-secondary">AMOUNT</span>
      </div>
      {paginated.map((entry, i) => (
        <Card
          key={`${entry.txHash}-${i}`}
          className="mb-4 border-2 border-dashed border-border shadow-md bg-background"
        >
          <CardBody className="p-0">
            <div className="flex flex-col gap-3 bg-explorer-row p-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.EXPLORER_TX(chain, entry.txHash)}
                  className="break-all font-mono text-sm text-accent-blue hover:underline"
                >
                  {entry.txHash}
                </Link>
                <CopyButton text={entry.txHash} size={14} />
              </div>
              <Chip
                size="sm"
                variant="flat"
                color={entry.action === "minted" ? "success" : "danger"}
              >
                {entry.action === "minted" ? "Mint" : "Burn"}
              </Chip>
              <span className="font-mono text-sm font-medium">
                {entry.amount}
              </span>
            </div>
          </CardBody>
        </Card>
      ))}
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
