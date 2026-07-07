"use client";

import { type cardano } from "@laceanatomy/types";
import type { Network } from "@laceanatomy/types/cardano";
import { EmptyState } from "~/app/_components/EmptyState";
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
    return <EmptyState message="No transactions found for this network." />;
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
