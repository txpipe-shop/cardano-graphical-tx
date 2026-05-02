"use client";

import { Button } from "@heroui/react";
import type { BlockCursor, BlockWithTxs } from "@laceanatomy/provider-core";
import type { Cardano, cardano } from "@laceanatomy/types";
import { useState } from "react";
import { BlockTxsAccordion } from "~/app/_components/ExplorerSection/Transactions/BlockTxsAccordion";
import { loadMoreBlocks } from "./actions";
import { EXPLORER_BLOCK_PAGE_SIZE } from "~/app/_utils";

interface BlocksListProps {
  chain: string;
  initialData: BlockWithTxs<cardano.UTxO, cardano.Tx, Cardano>[];
  initialNextCursor?: BlockCursor;
}

export function BlocksList({ chain, initialData, initialNextCursor }: BlocksListProps) {
  const [blocks, setBlocks] =
    useState<BlockWithTxs<cardano.UTxO, cardano.Tx, Cardano>[]>(initialData);
  const [nextCursor, setNextCursor] = useState<BlockCursor | undefined>(initialNextCursor);
  const [loading, setLoading] = useState(false);

  const onLoadMore = async () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const result = await loadMoreBlocks(chain, nextCursor);
      const oldestHeight = result.data.at(-1)?.block.height;
      setBlocks((prev) => [...prev, ...result.data]);

      setNextCursor(oldestHeight ? { height: oldestHeight - EXPLORER_BLOCK_PAGE_SIZE } : undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <BlockTxsAccordion blocksWithTxs={blocks} chain={chain} />
      {nextCursor && (
        <div className="flex justify-center">
          <Button
            onPress={onLoadMore}
            isLoading={loading}
            variant="flat"
            className="bg-explorer-row text-p-secondary shadow-sm"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
