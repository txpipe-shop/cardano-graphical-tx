"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import type { BlockWithTxs } from "@laceanatomy/provider-core";
import type { Cardano, cardano } from "@laceanatomy/types";
import Link from "next/link";
import { EmptyState } from "~/app/_components/EmptyState";
import { ROUTES } from "~/app/_utils";
import { formatAda } from "~/app/_utils/explorer";
import { type Network } from "~/app/_utils/network-config";
import DateViewer from "../DateViewer";
import ClockIcon from "../Icons/ClockIcon";
import { TxTable } from "./TxTable";

interface BlockTxsAccordionProps {
  blocksWithTxs: BlockWithTxs<cardano.UTxO, cardano.Tx, Cardano>[];
  chain: Network;
}

export function BlockTxsAccordion({
  blocksWithTxs,
  chain,
}: BlockTxsAccordionProps) {
  if (blocksWithTxs.length === 0) {
    return <EmptyState message="No blocks found for this network." />;
  }

  const allKeys = blocksWithTxs.map((b) => b.block.hash);

  return (
    <Accordion
      selectionMode="multiple"
      defaultExpandedKeys={allKeys}
      showDivider={false}
    >
      {blocksWithTxs.map(({ block, transactions }) => (
        <AccordionItem
          key={block.hash}
          variant="splitted"
          classNames={{ indicator: "text-foreground" }}
          className="mb-3"
          title={
            <div
              className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-sm">
                Height: {block.height.toString()}
              </span>
              <span className="font-mono text-sm">
                Slot: {block.slot.toString()}
              </span>
              <span className="font-mono text-sm">
                Hash:&nbsp;
                <Link
                  href={ROUTES.EXPLORER_BLOCK(chain as Network, block.hash)}
                  className="break-all font-mono text-sm text-accent-blue hover:underline"
                >
                  {block.hash}
                </Link>
              </span>

              <span className="flex items-center gap-2 text-sm text-p-secondary">
                <ClockIcon size={14} />
                <DateViewer timestamp={block.time} unit="milliseconds" />
              </span>
              <span className="text-sm text-p-secondary">
                {block.txCount.toString()} tx{block.txCount !== 1n ? "s" : ""}
              </span>
              <span className="text-sm font-medium">
                {formatAda(block.fees)}
              </span>
            </div>
          }
        >
          <TxTable transactions={transactions} chain={chain} />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
