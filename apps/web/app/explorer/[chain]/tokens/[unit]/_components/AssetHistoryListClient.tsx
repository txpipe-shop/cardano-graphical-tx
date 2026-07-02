"use client";

import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { ROUTES } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import type { AssetHistory } from "../_shared";
import { loadMoreHistory } from "./actions";

const PAGE_SIZE = 20;

interface Props {
  chain: Network;
  unit: string;
  initialHistory: AssetHistory[];
  hasMore: boolean;
}

function actionPill(action: AssetHistory["action"]) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium shadow-sm ${action === "minted" ? "text-success" : "text-danger"}`}
    >
      {action === "minted" ? "Mint" : "Burn"}
    </span>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function TxHashPill({ chain, hash }: { chain: Network; hash: string }) {
  return (
    <Tooltip content={hash} placement="top" delay={150}>
      <Link
        href={ROUTES.EXPLORER_TX(chain, hash)}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-p-primary shadow-sm transition-colors hover:bg-surface/80 whitespace-nowrap"
      >
        <ExternalLinkIcon />
        {hash.slice(0, 8)}…{hash.slice(-8)}
      </Link>
    </Tooltip>
  );
}

export function AssetHistoryListClient({
  chain,
  unit,
  initialHistory,
  hasMore: initialHasMore,
}: Props) {
  const [history, setHistory] = useState(initialHistory);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);

  const onLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await loadMoreHistory(chain, unit, currentPage);
      const allItems = result.data;
      setHistory((prev) => [...prev, ...allItems]);
      setHasMore(allItems.length >= PAGE_SIZE);
      setCurrentPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border border-default-200 shadow-none">
        <CardBody className="p-0 md:hidden">
          <div className="space-y-4 p-4">
            {history.map((entry, i) => (
              <div
                key={`${entry.txHash}-${i}`}
                className="space-y-2 rounded-lg border border-border bg-surface p-3"
              >
                <div>
                  <p className="text-xs font-bold text-p-secondary">TX Hash</p>
                  <div className="flex items-center gap-2">
                    <TxHashPill chain={chain} hash={entry.txHash} />
                    <CopyButton text={entry.txHash} size={14} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-p-secondary">Action</p>
                  {actionPill(entry.action)}
                </div>
                <div>
                  <p className="text-xs font-bold text-p-secondary">Amount</p>
                  <span className="font-mono text-sm">{entry.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
        <CardBody className="hidden p-0 md:block overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b bg-explorer-row text-p-secondary font-medium">
              <tr>
                <th scope="col" className="px-4 py-3">
                  TX Hash
                </th>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
                <th scope="col" className="px-4 py-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((entry, i) => (
                <tr key={`${entry.txHash}-${i}`}>
                  <td className="px-4 py-3 align-top bg-surface">
                    <div className="flex items-center gap-2">
                      <TxHashPill chain={chain} hash={entry.txHash} />
                      <CopyButton text={entry.txHash} size={14} />
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top bg-surface">
                    {actionPill(entry.action)}
                  </td>
                  <td className="px-4 py-3 align-top bg-surface font-mono text-sm">
                    {entry.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
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
