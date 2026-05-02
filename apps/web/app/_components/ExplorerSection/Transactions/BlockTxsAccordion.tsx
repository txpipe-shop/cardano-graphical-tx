"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import type { BlockWithTxs } from "@laceanatomy/provider-core";
import type { Cardano, cardano } from "@laceanatomy/types";
import ClockIcon from "../Icons/ClockIcon";
import { TxTable } from "./TxTable";

interface BlockTxsAccordionProps {
  blocksWithTxs: BlockWithTxs<cardano.UTxO, cardano.Tx, Cardano>[];
  chain: string;
}

export function BlockTxsAccordion({ blocksWithTxs, chain }: BlockTxsAccordionProps) {
  if (blocksWithTxs.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border shadow-md bg-surface p-8 text-center text-p-secondary">
        No blocks found for this network.
      </div>
    );
  }

  const allKeys = blocksWithTxs.map((b) => b.block.hash);

  return (
    <Accordion selectionMode="multiple" defaultExpandedKeys={allKeys} showDivider={false}>
      {
        blocksWithTxs.map(({ block, transactions }) => (
          <AccordionItem
            key={block.hash}
            variant="splitted"
            classNames={{ indicator: "text-foreground" }}
            className="mb-3"
            title={
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
                <span className="font-mono text-sm">
                  Height: {block.height.toString()}
                </span>
                <span className="font-mono text-sm">
                  Slot: {block.slot.toString()}
                </span>
                <span className="font-mono text-sm">
                  Hash: {block.hash}
                </span>
                <span className="flex items-center gap-2 text-sm text-p-secondary">
                  <ClockIcon size={14} />
                  {new Date(block.time).toLocaleString()}
                </span>
                <span className="text-sm text-p-secondary">
                  {block.txCount.toString()} tx{block.txCount !== 1n ? "s" : ""}
                </span>
                <span className="text-sm font-medium">
                  {(Number(block.fees) / 1_000_000).toFixed(6)} ₳
                </span>
              </div>
            }
          >
            <TxTable transactions={transactions} chain={chain} />
          </AccordionItem>
        ))
      }
    </Accordion >
  );
}
