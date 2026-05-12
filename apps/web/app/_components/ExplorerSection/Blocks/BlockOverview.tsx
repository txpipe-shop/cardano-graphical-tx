"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { type BlockRes } from "@laceanatomy/provider-core";
import { type Address, type cardano, type Unit } from "@laceanatomy/types";
import { formatAda } from "~/app/_utils/explorer";
import ColoredAddress from "../ColoredAddress";
import CopyButton from "../CopyButton";
import DateViewer from "../DateViewer";
import TokenPill from "../TokenPill";

interface BlockOverviewProps {
  block: BlockRes;
  transactions: cardano.Tx[];
}

export default function BlockOverview({
  block,
  transactions,
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
      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardHeader className="pb-2 text-p-primary font-semibold">
          Block Metadata
        </CardHeader>
        <CardBody className="space-y-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-p-secondary">Hash:</span>
            <span className="break-all font-mono">{block.hash}</span>
            <CopyButton text={block.hash} size={14} />
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-p-secondary">Height:</span>{" "}
              <span className="font-mono">{block.height.toString()}</span>
            </div>
            <div>
              <span className="text-p-secondary">Slot:</span>{" "}
              <span className="font-mono">{block.slot.toString()}</span>
            </div>
            {block.epoch !== undefined && (
              <div>
                <span className="text-p-secondary">Epoch:</span>{" "}
                <span className="font-mono">{block.epoch.toString()}</span>
              </div>
            )}
          </div>
          <div>
            <span className="text-p-secondary">Time:</span>{" "}
            <DateViewer timestamp={block.time} unit="milliseconds" />
          </div>
          {block.confirmations !== undefined && (
            <div>
              <span className="text-p-secondary">Confirmations:</span>{" "}
              <span className="font-mono">
                {block.confirmations.toString()}
              </span>
            </div>
          )}
          {block.size !== undefined && (
            <div>
              <span className="text-p-secondary">Size:</span>{" "}
              <span className="font-mono">{block.size.toString()} bytes</span>
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardHeader className="pb-2 text-p-primary font-semibold">
          ADA Movement
        </CardHeader>
        <CardBody className="space-y-2 text-sm">
          <div>
            <span className="text-p-secondary">Total ADA In:</span>{" "}
            <span className="font-mono">{formatAda(totalIn)}</span>
          </div>
          <div>
            <span className="text-p-secondary">Total ADA Out:</span>{" "}
            <span className="font-mono">{formatAda(totalOut)}</span>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-2 border-dashed border-border shadow-md bg-surface">
          <CardHeader className="pb-2 text-p-primary font-semibold">
            Top Senders
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            {topSenders.length === 0 ? (
              <span className="text-p-secondary">No inputs</span>
            ) : (
              topSenders.map(([addr, value]) => (
                <div key={addr} className="flex justify-between gap-2">
                  <ColoredAddress address={addr} />
                  <span className="shrink-0 font-mono">{formatAda(value)}</span>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card className="border-2 border-dashed border-border shadow-md bg-surface">
          <CardHeader className="pb-2 text-p-primary font-semibold">
            Top Recipients
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            {topRecipients.length === 0 ? (
              <span className="text-p-secondary">No outputs</span>
            ) : (
              topRecipients.map(([addr, value]) => (
                <div key={addr} className="flex justify-between gap-2">
                  <ColoredAddress address={addr} />
                  <span className="shrink-0 font-mono">{formatAda(value)}</span>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="border-2 border-dashed border-border shadow-md bg-surface">
        <CardHeader className="pb-2 text-p-primary font-semibold">
          Aggregate Stats
        </CardHeader>
        <CardBody className="space-y-2 text-sm">
          <div>
            <span className="text-p-secondary">Total Transactions:</span>{" "}
            <span className="font-mono">{block.txCount.toString()}</span>
          </div>
          <div>
            <span className="text-p-secondary">Total Fees:</span>{" "}
            <span className="font-mono">{formatAda(totalFees)}</span>
          </div>
          <div>
            <span className="text-p-secondary">Total ADA Moved:</span>{" "}
            <span className="font-mono">{formatAda(totalAdaMoved)}</span>
          </div>
          <div>
            <span className="text-p-secondary">Unique Addresses:</span>{" "}
            <span className="font-mono">{uniqueAddresses.size}</span>
          </div>
        </CardBody>
      </Card>

      {assets.length > 0 && (
        <Card className="border-2 border-dashed border-border shadow-md bg-surface">
          <CardHeader className="pb-2 text-p-primary font-semibold">
            Asset Movement
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {assets.map(([unit, amount]) => (
                <TokenPill key={unit} unit={unit} amount={amount} />
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
