"use client";

import { useSearchParams } from "next/navigation";
import type { DetailTab } from "~/app/_components/DetailTabs";
import { DetailTabs } from "~/app/_components/DetailTabs";
import { buildTabUrl } from "~/app/_utils/tabs";

export type AddressTab = "Dissect" | "UTxOs" | "Transactions";

interface AddressTabsProps {
  tabs: DetailTab[];
  activeTab: AddressTab;
  basePath: string;
}

export default function AddressTabs({
  tabs,
  activeTab,
  basePath,
}: Readonly<AddressTabsProps>) {
  const searchParams = useSearchParams();

  return (
    <DetailTabs
      tabs={tabs}
      defaultTab="Dissect"
      activeTab={activeTab}
      onTabChange={(key) => {
        const url = buildTabUrl(
          basePath,
          searchParams,
          key as string,
          "Dissect",
        );
        window.history.replaceState(null, "", url);
      }}
      ariaLabel="Address details"
    />
  );
}
