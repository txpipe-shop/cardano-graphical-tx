"use client";

import { type Address, type cardano } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { useState } from "react";
import { PaginationButton } from "~/app/_components/ExplorerSection/PaginationButton";
import { UtxoList } from "~/app/_components/ExplorerSection/Transactions/TxOverview";
import { ADDRESS_PAGE_SIZE } from "~/app/_utils/constants";
import { loadMoreUTxOs } from "./actions";

interface Props {
  chain: Network;
  address: Address;
  initialUtxos: cardano.UTxO[];
  hasMore: boolean;
}

export function AddressUTxOsListClient({
  chain,
  address,
  initialUtxos,
  hasMore: initialHasMore,
}: Props) {
  const [utxos, setUtxos] = useState(initialUtxos);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(ADDRESS_PAGE_SIZE);

  const onLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await loadMoreUTxOs(chain, address, currentOffset);
      const allItems = result.data;
      const nextItems = allItems.slice(0, Number(ADDRESS_PAGE_SIZE));
      setUtxos((prev) => [...prev, ...nextItems]);
      setHasMore(allItems.length > ADDRESS_PAGE_SIZE);
      setCurrentOffset((prev) => prev + ADDRESS_PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <UtxoList list={utxos} mint={{}} showAddress={false} />
      {hasMore && (
        <div className="flex justify-center">
          <PaginationButton onClick={onLoadMore} isLoading={loading}>
            Load More
          </PaginationButton>
        </div>
      )}
    </div>
  );
}
