"use client";

import { Card, CardBody } from "@heroui/react";
import { Unit } from "@laceanatomy/types";
import { useState } from "react";
import { DetailTabs, type DetailTab } from "~/app/_components/DetailTabs";
import { EmptyState } from "~/app/_components/EmptyState";
import { type TokenTab } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import type { TokenPageData } from "~/app/explorer/[chain]/tokens/[unit]/_shared";
import HoldersTab from "./HoldersTab";
import TokenOverview from "./TokenOverview";
import TransactionsTab from "./TransactionsTab";

export interface TokenTabsProps {
  data: TokenPageData;
  tab: TokenTab;
  chain: Network;
  historyContent?: React.ReactNode;
}

export default function TokenTabs({
  data,
  tab,
  chain,
  historyContent,
}: TokenTabsProps) {
  const [activeTab, setActiveTab] = useState(tab);

  const tabs: DetailTab[] = [
    {
      key: "Holders",
      title: "Holders",
      content: (
        <HoldersTab
          chain={chain}
          unit={Unit(data.assetInfo.unit)}
          initialHolders={data.addresses}
          hasMore={data.hasMoreHolders}
          allHolders={data.allHolders}
        />
      ),
    },
    {
      key: "History",
      title: "History",
      content: historyContent ?? <EmptyState message="No history found." />,
    },
    {
      key: "Transactions",
      title: "Transactions",
      content: (
        <TransactionsTab
          transactions={data.transactions}
          chain={chain}
          unit={Unit(data.assetInfo.unit)}
          hasMoreTransactions={data.hasMoreTransactions}
        />
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <Card className="rounded-lg border-2 border-dashed border-border bg-surface shadow-md">
        <CardBody className="p-0">
          <div className="flex flex-col gap-4 p-6">
            <TokenOverview
              assetInfo={data.assetInfo}
              holdersCount={data.addressesTotal}
            />
          </div>
          <div className="border-t border-border p-4">
            <DetailTabs
              tabs={tabs}
              defaultTab={"Holders"}
              activeTab={activeTab}
              onTabChange={(key) => setActiveTab(key as TokenTab)}
              ariaLabel="Token detail tabs"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
