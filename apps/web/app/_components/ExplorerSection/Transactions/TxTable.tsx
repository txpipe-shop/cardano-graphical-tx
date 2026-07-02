"use client";

import { Card, CardBody } from "@heroui/react";
import { type cardano } from "@laceanatomy/types";
import type { Network } from "~/app/_utils";
import { TxRow } from "./TxRow";

interface TxTableProps {
  transactions: cardano.Tx[];
  chain: Network;
  highlightAddress?: cardano.UTxO["address"];
}

export function TxTable({
  transactions,
  chain,
  highlightAddress,
}: Readonly<TxTableProps>) {
  if (transactions.length === 0) {
    return (
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          No transactions found for this network.
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <TxRow
          key={tx.hash}
          tx={tx}
          chain={chain}
          highlightAddress={highlightAddress}
        />
      ))}
    </div>
  );
}
