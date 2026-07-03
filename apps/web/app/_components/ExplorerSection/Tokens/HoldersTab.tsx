"use client";

import { Card, CardBody } from "@heroui/react";
import { Address, type Unit } from "@laceanatomy/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { EmptyState } from "~/app/_components/EmptyState";
import ColoredAddress from "~/app/_components/ExplorerSection/ColoredAddress";
import { PaginationButton } from "~/app/_components/ExplorerSection/PaginationButton";
import { type Network } from "~/app/_utils/network-config";
import type { AssetAddress } from "~/app/explorer/[chain]/tokens/[unit]/_shared";
import { loadMoreHolders } from "./actions";
import { HOLDERS_PAGE_SIZE as PAGE_SIZE } from "./constants";

interface HoldersTabProps {
  chain: Network;
  unit: Unit;
  initialHolders: AssetAddress[];
  hasMore: boolean;
  allHolders?: AssetAddress[];
}

export default function HoldersTab({
  chain,
  unit,
  initialHolders,
  hasMore: initialHasMore,
  allHolders,
}: HoldersTabProps) {
  const [holders, setHolders] = useState(initialHolders);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(2);
  const [localOffset, setLocalOffset] = useState(PAGE_SIZE);

  const onLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (allHolders) {
        const nextItems = allHolders.slice(
          localOffset,
          localOffset + PAGE_SIZE,
        );
        setHolders((prev) => [...prev, ...nextItems]);
        setHasMore(localOffset + PAGE_SIZE < allHolders.length);
        setLocalOffset((prev) => prev + PAGE_SIZE);
      } else {
        const result = await loadMoreHolders(chain, unit, nextPage);
        const items = result.data;
        setHolders((prev) => [...prev, ...items]);
        setHasMore(items.length >= PAGE_SIZE);
        setNextPage((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load holders",
      );
    } finally {
      setLoading(false);
    }
  };

  if (holders.length === 0) {
    return <EmptyState message="No holders found." />;
  }

  return (
    <div className="space-y-4">
      <Card className="border border-default-200 shadow-none">
        <CardBody className="p-0 md:hidden">
          <div className="space-y-4 p-4">
            {holders.map((addr) => (
              <div
                key={addr.address}
                className="space-y-2 rounded-lg border border-border bg-surface p-3"
              >
                <div>
                  <p className="text-xs font-bold text-p-secondary">Address</p>
                  <ColoredAddress
                    address={Address(addr.address)}
                    chain={chain}
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-p-secondary">Quantity</p>
                  <span className="font-mono text-sm">{addr.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
        <CardBody className="hidden p-0 md:block overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b bg-explorer-row text-p-secondary font-medium">
              <tr>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {holders.map((addr) => (
                <tr key={addr.address}>
                  <td className="px-4 py-3 align-top bg-surface">
                    <ColoredAddress
                      address={Address(addr.address)}
                      chain={chain}
                    />
                  </td>
                  <td className="px-4 py-3 align-top bg-surface font-mono text-sm">
                    {addr.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {hasMore && (
        <div className="flex justify-center">
          <PaginationButton
            onClick={onLoadMore}
            isLoading={loading}
          >
            Load More
          </PaginationButton>
        </div>
      )}
    </div>
  );
}
