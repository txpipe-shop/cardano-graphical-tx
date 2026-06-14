"use client";

import { Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";

export interface DetailTab {
  key: string;
  title: string;
  content: React.ReactNode;
}

interface DetailTabsProps {
  tabs: DetailTab[];
  defaultTab: string;
  activeTab?: string;
  onTabChange?: (key: string) => void;
  ariaLabel?: string;
}

export function DetailTabs({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  ariaLabel = "Detail tabs",
}: DetailTabsProps) {
  const [active, setActive] = useState(activeTab ?? defaultTab);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeTab) setActive(activeTab);
  }, [activeTab]);

  return (
    <div className="flex flex-1 min-h-0 w-full flex-col space-y-4">
      <Tabs
        aria-label={ariaLabel}
        selectedKey={active}
        onSelectionChange={(key) => {
          setActive(key as string);
          onTabChange?.(key as string);
        }}
        variant="light"
        classNames={{
          tabList: "w-full flex-wrap md:flex-nowrap",
          tab: "px-3 py-1 rounded border border-border bg-surface h-full w-auto md:w-full",
          tabContent: "text-p-primary text-sm font-medium",
          panel: "flex min-h-0 flex-1 flex-col p-0",
        }}
      >
        {tabs.map((t) => (
          <Tab key={t.key} title={t.title}>
            {t.content}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
