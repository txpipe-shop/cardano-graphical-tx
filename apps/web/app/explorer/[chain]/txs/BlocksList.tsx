"use client";

import type { BlockCursor, BlockWithTxs } from "@laceanatomy/provider-core";
import type { Cardano, cardano } from "@laceanatomy/types";
import { useState } from "react";
import { PaginationButton } from "~/app/_components/ExplorerSection/PaginationButton";
import { BlockTxsAccordion } from "~/app/_components/ExplorerSection/Transactions/BlockTxsAccordion";
import { getBlockPageSize, type Network } from "~/app/_utils";
import { loadMoreBlocks } from "./actions";

interface BlocksListProps {
  chain: Network;
  initialData: BlockWithTxs<cardano.UTxO, cardano.Tx, Cardano>[];
  initialNextCursor?: BlockCursor;
}

export function BlocksList({
  chain,
  initialData,
  initialNextCursor,
}: BlocksListProps) {
  const [blocks, setBlocks] =
    useState<BlockWithTxs<cardano.UTxO, cardano.Tx, Cardano>[]>(initialData);
  const [nextCursor, setNextCursor] = useState<BlockCursor | undefined>(
    initialNextCursor,
  );
  const [loading, setLoading] = useState(false);

  const onLoadMore = async () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const result = await loadMoreBlocks(chain, nextCursor);
      const oldestHeight = result.data.at(-1)?.block.height;
      setBlocks((prev) => [...prev, ...result.data]);

      setNextCursor(
        oldestHeight
          ? { height: oldestHeight - getBlockPageSize(chain as Network) }
          : undefined,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <BlockTxsAccordion blocksWithTxs={blocks} chain={chain} />
      {nextCursor && (
        <div className="flex justify-center">
          <PaginationButton onClick={onLoadMore} isLoading={loading}>
            Load More
          </PaginationButton>
        </div>
      )}
    </div>
  );
}
