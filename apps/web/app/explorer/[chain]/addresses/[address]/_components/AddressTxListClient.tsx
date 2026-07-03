"use client";

import { type Address, type cardano } from "@laceanatomy/types";
import { useState } from "react";
import { TxTable } from "~/app/_components/ExplorerSection/Transactions";
import { PaginationButton } from "~/app/_components/ExplorerSection/PaginationButton";
import { ADDRESS_PAGE_SIZE } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import { loadMoreTxs } from "./actions";

interface Props {
  chain: Network;
  address: Address;
  initialTxs: cardano.Tx[];
  hasMore: boolean;
}

export function AddressTxListClient({
  chain,
  address,
  initialTxs,
  hasMore: initialHasMore,
}: Props) {
  const [txs, setTxs] = useState(initialTxs);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(ADDRESS_PAGE_SIZE);

  const onLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await loadMoreTxs(chain, address, currentOffset);
      const allItems = result.data;
      const nextItems = allItems.slice(0, Number(ADDRESS_PAGE_SIZE));
      setTxs((prev) => [...prev, ...nextItems]);
      setHasMore(allItems.length > ADDRESS_PAGE_SIZE);
      setCurrentOffset((prev) => prev + ADDRESS_PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <TxTable transactions={txs} chain={chain} highlightAddress={address} />
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
