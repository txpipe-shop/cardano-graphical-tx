"use client";

import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import { type Network } from "@laceanatomy/types/cardano";
import { DetailLabel } from "~/app/_components/DetailLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { MonoText } from "~/app/_components/MonoText";
import { SubLabel } from "~/app/_components/SubLabel";
import { useConfigs, useUI } from "~/app/_contexts";
import type { IGraphicalTransaction } from "~/app/_interfaces";
import Loading from "~/app/loading";
import TOPICS from "./topics";
import { Stat } from "./TransactionDetails";
import { GROUP_TOPIC_KEY, useDissectSidebar } from "./useDissectSidebar";
import { formatAda } from "./utils";

export function DissectSection({
  tx,
  chain: chainProp,
}: {
  tx: IGraphicalTransaction;
  chain?: Network;
}) {
  const { loading } = useUI();
  const { configs } = useConfigs();
  const chain = chainProp ?? (configs.net as Network | undefined);
  const { grouped, setActiveKey, collapsedGroups, toggleGroup, activeItem } =
    useDissectSidebar(tx, chain);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-0 w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4 mb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3 flex-shrink-0">
          <MonoText size="base" className="font-bold text-accent-blue">
            {tx.era}
          </MonoText>
          <span
            className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${tx.scriptsSuccessful ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
          >
            {tx.scriptsSuccessful ? "SCRIPTS OK" : "SCRIPTS FAIL"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-6 md:gap-y-2 md:ml-auto">
          <Stat label="Fee" value={formatAda(tx.fee)} suffix="₳" />
          <Stat label="Size" value={`${tx.size}`} suffix="B" />
          {tx.blockHeight !== undefined && (
            <Stat label="Block height" value={`${tx.blockHeight.toFixed(0)}`} />
          )}
          {tx.networkId !== undefined && (
            <Stat label="Network" value={`${tx.networkId}`} />
          )}
          {tx.scriptDataHash && (
            <div className="flex items-baseline gap-1.5 flex-shrink-0">
              <DetailLabel>Script Data Hash</DetailLabel>
              <div className="flex items-center gap-1">
                <Tooltip content={tx.scriptDataHash} delay={300} size="sm">
                  <MonoText className="font-medium text-p-primary cursor-default">
                    {tx.scriptDataHash.slice(0, 10)}...
                    {tx.scriptDataHash.slice(-10)}
                  </MonoText>
                </Tooltip>
                <CopyButton text={tx.scriptDataHash} size={12} />
              </div>
            </div>
          )}
          {tx.auxiliaryDataHash && (
            <div className="flex items-baseline gap-1.5 flex-shrink-0">
              <DetailLabel>Aux Data Hash</DetailLabel>
              <div className="flex items-center gap-1">
                <Tooltip content={tx.auxiliaryDataHash} delay={300} size="sm">
                  <MonoText className="font-medium text-p-primary cursor-default">
                    {tx.auxiliaryDataHash.slice(0, 10)}...
                    {tx.auxiliaryDataHash.slice(-10)}
                  </MonoText>
                </Tooltip>
                <CopyButton text={tx.auxiliaryDataHash} size={12} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Card className="shadow-none border border-border bg-surface flex-1 min-h-0">
        <CardBody className="flex flex-col gap-6 p-0 md:flex-row min-h-0">
          <div className="flex flex-col gap-3 border-r border-border min-w-[220px] max-w-[260px] overflow-y-auto p-4">
            {[...grouped.entries()].map(([group, groupItems]) => {
              const isCollapsed = collapsedGroups.has(group);
              return (
                <div key={group} className="flex flex-col gap-1">
                  <button
                    className="text-xs font-semibold uppercase tracking-wide text-p-secondary px-1 flex items-center gap-1 w-full text-left hover:text-p-primary transition-colors cursor-pointer"
                    onClick={() => toggleGroup(group)}
                  >
                    <span className="inline-block w-3 flex-shrink-0 text-center leading-none">
                      {isCollapsed ? "▸" : "▾"}
                    </span>
                    {group} ({groupItems.length})
                  </button>
                  {!isCollapsed &&
                    groupItems.map((item) => {
                      const isActive = item.key === (activeItem?.key ?? "");
                      return (
                        <Button
                          key={item.key}
                          size="sm"
                          variant={isActive ? "solid" : "ghost"}
                          color={isActive ? "primary" : "default"}
                          className="justify-start font-mono text-xs min-w-0"
                          onPress={() => setActiveKey(item.key)}
                        >
                          <span className="truncate">{item.label}</span>
                        </Button>
                      );
                    })}
                </div>
              );
            })}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4 pt-4">
            {activeItem && GROUP_TOPIC_KEY[activeItem.group] && (
              <SubLabel className="mb-4 leading-relaxed border-b border-border pb-3 block">
                {TOPICS[GROUP_TOPIC_KEY[activeItem.group]!]}
              </SubLabel>
            )}
            {activeItem?.content ?? (
              <div className="py-20 text-center">
                <p className="text-lg font-semibold text-p-secondary">0</p>
                <p className="mt-2 text-sm text-p-secondary">
                  No items to display
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
