"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DetailTabs, type DetailTab } from "~/app/_components/DetailTabs";
import { type TokenTab } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import type { TokenPageData } from "~/app/explorer/[chain]/tokens/[unit]/_shared";
import HistoryTab from "./HistoryTab";
import HoldersTab from "./HoldersTab";
import TokenOverview from "./TokenOverview";
import TransactionsTab from "./TransactionsTab";

export interface TokenTabsProps {
  data: TokenPageData;
  tab: TokenTab;
  chain: Network;
  page: number;
}

export default function TokenTabs({ data, tab, chain, page }: TokenTabsProps) {
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
      title: `Holders (${data.addressesTotal})`,
      content: <HoldersTab addresses={data.addresses} page={page} />,
    },
    {
      key: "History",
      title: "History",
      content: <HistoryTab history={data.history} chain={chain} page={page} />,
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
      <TokenOverview
        assetInfo={data.assetInfo}
        chain={chain}
        holdersCount={data.addressesTotal}
      />
      <DetailTabs
        tabs={tabs}
        defaultTab={"Holders"}
        activeTab={tab}
        onTabChange={handleTabChange}
        ariaLabel="Token detail tabs"
      />
    </div>
  );
}
