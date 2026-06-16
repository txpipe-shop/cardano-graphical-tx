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

export default function HoldersTab({ addresses, page }: HoldersTabProps) {
  const totalPages = Math.max(1, Math.ceil(addresses.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return addresses.slice(start, start + PAGE_SIZE);
  }, [addresses, currentPage]);

  if (addresses.length === 0) {
    return (
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          No holders found.
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 bg-explorer-row px-4 py-2 md:flex-row md:items-center md:justify-between md:gap-4">
        <span className="text-xs font-medium text-p-secondary">ADDRESS</span>
        <span className="text-xs font-medium text-p-secondary">QUANTITY</span>
      </div>
      {paginated.map((addr, i) => (
        <Card
          key={`${addr.address}-${i}`}
          className="mb-4 border-2 border-border shadow-md bg-surface"
        >
          <CardBody className="p-0">
            <div className="flex flex-col gap-3 bg-explorer-row p-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
              <span
                className="cursor-pointer hover:underline"
                title="Address details coming soon"
              >
                <ColoredAddress address={Address(addr.address)} />
              </span>
              <span className="font-mono text-sm font-medium text-p-primary">
                {addr.quantity}
              </span>
            </div>
          </CardBody>
        </Card>
      ))}
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
