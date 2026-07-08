"use client";

import type { BlockRes } from "@laceanatomy/provider-core";
import type { Address, cardano, Unit } from "@laceanatomy/types";
import type { Network } from "@laceanatomy/types/cardano";
import ColoredAddress from "~/app/_components/ExplorerSection/ColoredAddress";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import DateViewer from "~/app/_components/ExplorerSection/DateViewer";
import TokenPill from "~/app/_components/ExplorerSection/TokenPill";
import { InfoCard } from "~/app/_components/InfoCard";
import { KeyValue } from "~/app/_components/KeyValue";
import { formatAda } from "~/app/_utils/explorer";

interface BlockOverviewProps {
  block: BlockRes;
  transactions: cardano.Tx[];
  chain: Network;
}

export default function BlockOverview({
  block,
  transactions,
  chain,
}: BlockOverviewProps) {
  const totalFees = block.fees;
  const totalAdaMoved = transactions.reduce(
    (sum, tx) => sum + tx.outputs.reduce((s, o) => s + o.coin, 0n),
    0n,
  );
  const uniqueAddresses = new Set<string>();
  for (const tx of transactions) {
    for (const input of tx.inputs) uniqueAddresses.add(input.address);
    for (const output of tx.outputs) uniqueAddresses.add(output.address);
  }

  const senderMap = new Map<Address, bigint>();
  const recipientMap = new Map<Address, bigint>();
  const assetMap = new Map<Unit, bigint>();

  let totalIn = 0n;
  let totalOut = 0n;

  for (const tx of transactions) {
    for (const input of tx.inputs) {
      totalIn += input.coin;
      senderMap.set(
        input.address,
        (senderMap.get(input.address) ?? 0n) + input.coin,
      );
      for (const [unit, amount] of Object.entries(input.value) as [
        Unit,
        bigint,
      ][]) {
        if (unit === "lovelace") continue;
        assetMap.set(unit, (assetMap.get(unit) ?? 0n) + amount);
      }
    }
    for (const output of tx.outputs) {
      totalOut += output.coin;
      recipientMap.set(
        output.address,
        (recipientMap.get(output.address) ?? 0n) + output.coin,
      );
      for (const [unit, amount] of Object.entries(output.value) as [
        Unit,
        bigint,
      ][]) {
        if (unit === "lovelace") continue;
        assetMap.set(unit, (assetMap.get(unit) ?? 0n) + amount);
      }
    }
  }

  const topSenders = Array.from(senderMap.entries())
    .sort((a, b) => Number(b[1] - a[1]))
    .slice(0, 10);

  const topRecipients = Array.from(recipientMap.entries())
    .sort((a, b) => Number(b[1] - a[1]))
    .slice(0, 10);

  const assets = Array.from(assetMap.entries()).sort((a, b) =>
    Number(b[1] - a[1]),
  );

  return (
    <div className="space-y-4">
      <InfoCard header="Block Metadata">
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-p-secondary">Hash:</span>
            <span className="break-all font-mono">{block.hash}</span>
            <CopyButton text={block.hash} size={14} />
          </div>
          <div className="flex flex-wrap gap-4">
            <KeyValue label="Height" mono>
              {block.height.toString()}
            </KeyValue>
            <KeyValue label="Slot" mono>
              {block.slot.toString()}
            </KeyValue>
            {block.epoch !== undefined && (
              <KeyValue label="Epoch" mono>
                {block.epoch.toString()}
              </KeyValue>
            )}
          </div>
          <KeyValue label="Time">
            <DateViewer timestamp={block.time} unit="milliseconds" />
          </KeyValue>
          {block.confirmations !== undefined && (
            <KeyValue label="Confirmations" mono>
              {block.confirmations.toString()}
            </KeyValue>
          )}
          {block.size !== undefined && (
            <KeyValue label="Size" mono>
              {block.size.toString()} bytes
            </KeyValue>
          )}
        </div>
      </InfoCard>

      <InfoCard header="ADA Movement">
        <div className="space-y-2 text-sm">
          <KeyValue label="Total ADA In" mono>
            {formatAda(totalIn)}
          </KeyValue>
          <KeyValue label="Total ADA Out" mono>
            {formatAda(totalOut)}
          </KeyValue>
        </div>
      </InfoCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoCard header="Top Senders">
          <div className="space-y-2 text-sm">
            {topSenders.length === 0 ? (
              <span className="text-p-secondary">No inputs</span>
            ) : (
              topSenders.map(([addr, value]) => (
                <div key={addr} className="flex justify-between gap-2">
                  <ColoredAddress address={addr} chain={chain} />
                  <span className="shrink-0 font-mono">{formatAda(value)}</span>
                </div>
              ))
            )}
          </div>
        </InfoCard>

        <InfoCard header="Top Recipients">
          <div className="space-y-2 text-sm">
            {topRecipients.length === 0 ? (
              <span className="text-p-secondary">No outputs</span>
            ) : (
              topRecipients.map(([addr, value]) => (
                <div key={addr} className="flex justify-between gap-2">
                  <ColoredAddress address={addr} chain={chain} />
                  <span className="shrink-0 font-mono">{formatAda(value)}</span>
                </div>
              ))
            )}
          </div>
        </InfoCard>
      </div>

      <InfoCard header="Aggregate Stats">
        <div className="space-y-2 text-sm">
          <KeyValue label="Total Transactions" mono>
            {block.txCount.toString()}
          </KeyValue>
          <KeyValue label="Total Fees" mono>
            {formatAda(totalFees)}
          </KeyValue>
          <KeyValue label="Total ADA Moved" mono>
            {formatAda(totalAdaMoved)}
          </KeyValue>
          <KeyValue label="Unique Addresses" mono>
            {uniqueAddresses.size}
          </KeyValue>
        </div>
      </InfoCard>

      {assets.length > 0 && (
        <InfoCard header="Asset Movement">
          <div className="flex flex-wrap gap-2">
            {assets.map(([unit, amount]) => (
              <TokenPill key={unit} unit={unit} amount={amount} chain={chain} />
            ))}
          </div>
        </InfoCard>
      )}
    </div>
  );
}
