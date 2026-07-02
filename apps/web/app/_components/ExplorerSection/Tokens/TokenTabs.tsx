"use client";

import { Card, CardBody } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { DetailTabs, type DetailTab } from "~/app/_components/DetailTabs";
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
  page: number;
  historyContent?: React.ReactNode;
}

export default function TokenTabs({
  data,
  tab,
  chain,
  page,
  historyContent,
}: TokenTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    params.delete("page");
    router.replace(`?${params.toString()}`);
  };

  const tabs: DetailTab[] = [
    {
      key: "Holders",
      title: "Holders",
      content: (
        <HoldersTab
          chain={chain}
          unit={data.assetInfo.unit}
          initialHolders={data.addresses}
          hasMore={data.hasMoreHolders}
          allHolders={data.allHolders}
        />
      ),
    },
    {
      key: "History",
      title: "History",
      content: historyContent ?? (
        <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
          No history found.
        </div>
      ),
    },
    {
      key: "Transactions",
      title: "Transactions",
      content: (
        <TransactionsTab
          transactions={data.transactions}
          chain={chain}
          page={page}
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
              chain={chain}
              holdersCount={data.addressesTotal}
            />
          </div>
          <div className="border-t border-border p-4">
            <DetailTabs
              tabs={tabs}
              defaultTab={"Holders"}
              activeTab={tab}
              onTabChange={handleTabChange}
              ariaLabel="Token detail tabs"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
