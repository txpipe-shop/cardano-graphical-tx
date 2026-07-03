"use client";

import { type BlockRes } from "@laceanatomy/provider-core";
import { type cardano } from "@laceanatomy/types";
import { type BlockTab } from "~/app/_utils";
import { type Network } from "~/app/_utils/network-config";
import { DetailTabs } from "../../DetailTabs";
import BlockCbor from "./BlockCbor";
import BlockOverview from "./BlockOverview";
import BlockTransactions from "./BlockTransactions";

interface BlockTabsProps {
  block: BlockRes;
  transactions: cardano.Tx[];
  cbor: string | null;
  chain: Network;
  tab: BlockTab;
  txPage: number;
}

export default function BlockTabs({
  block,
  transactions,
  cbor,
  chain,
  tab,
  txPage,
}: BlockTabsProps) {
  const tabs = [
    {
      key: "Overview",
      title: "Overview",
      content: (
        <BlockOverview
          block={block}
          transactions={transactions}
          chain={chain as Network}
        />
      ),
    },
    {
      key: "Transactions",
      title: "Transactions",
      content: (
        <BlockTransactions
          transactions={transactions}
          chain={chain}
          page={txPage}
        />
      ),
    },
    {
      key: "CBOR",
      title: "CBOR",
      content: <BlockCbor cbor={cbor} />,
    },
  ];

  return (
    <DetailTabs
      tabs={tabs}
      defaultTab="Overview"
      activeTab={tab}
      ariaLabel="Block details"
    />
  );
}
