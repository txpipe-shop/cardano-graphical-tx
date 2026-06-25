"use client";

import { Button } from "@heroui/react";
import { type Address, type cardano } from "@laceanatomy/types";
import { useState } from "react";
import { UtxoList } from "~/app/_components/ExplorerSection/Transactions/TxOverview";
import { type Network } from "~/app/_utils/network-config";
import { loadMoreUTxOs } from "./actions";

const PAGE_SIZE = 20n;

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
  const [currentOffset, setCurrentOffset] = useState(PAGE_SIZE);

  const onLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await loadMoreUTxOs(chain, address, currentOffset);
      const allItems = result.data;
      const nextItems = allItems.slice(0, Number(PAGE_SIZE));
      setUtxos((prev) => [...prev, ...nextItems]);
      setHasMore(allItems.length >= PAGE_SIZE);
      setCurrentOffset((prev) => prev + PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <UtxoList list={utxos} mint={{}} showAddress={false} />
      {hasMore && (
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
