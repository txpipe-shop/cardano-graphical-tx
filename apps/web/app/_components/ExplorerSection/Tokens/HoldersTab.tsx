"use client";

import { Card, CardBody } from "@heroui/react";
import { Address } from "@laceanatomy/types";
import { useMemo } from "react";
import type { AssetAddress } from "~/app/explorer/[chain]/tokens/[unit]/_shared";
import ColoredAddress from "../ColoredAddress";
import Pagination from "../Pagination";

const PAGE_SIZE = 30;

interface HoldersTabProps {
  addresses: AssetAddress[];
  page: number;
}

export default function HoldersTab({
  addresses,
  page,
}: HoldersTabProps) {
  const totalPages = Math.max(1, Math.ceil(addresses.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return addresses.slice(start, start + PAGE_SIZE);
  }, [addresses, currentPage]);

  if (addresses.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
        No holders found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border border-default-200 shadow-none">
        <CardBody className="p-0 md:hidden">
          <div className="space-y-4 p-4">
            {paginated.map((addr, i) => (
              <div
                key={`${addr.address}-${i}`}
                className="space-y-2 rounded-lg border border-border bg-surface p-3"
              >
                <div>
                  <p className="text-xs font-bold text-p-secondary">Address</p>
                  <ColoredAddress address={Address(addr.address)} />
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
              {paginated.map((addr, i) => (
                <tr key={`${addr.address}-${i}`}>
                  <td className="px-4 py-3 align-top bg-surface">
                    <ColoredAddress address={Address(addr.address)} />
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
      {addresses.length > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath=""
        />
      )}
    </div>
  );
}
