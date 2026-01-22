"use client";

import { Button, Card, CardBody, Code } from "@heroui/react";
import { type cardano } from "@laceanatomy/types";
import { useEffect, useMemo, useState } from "react";

function formatNumber(value?: bigint | number | string) {
  if (value === undefined || value === null) return "-";
  return value.toString();
}

function formatHash(value?: string) {
  if (!value || value === "") return "-";
  return value;
}

function formatPurpose(purpose?: cardano.RdmrPurpose) {
  if (!purpose) return "-";
  return purpose.charAt(0).toUpperCase() + purpose.slice(1);
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <Code className="block w-full whitespace-pre-wrap break-all bg-gray-50 p-3">
        {value}
      </Code>
    </div>
  );
}

export default function TxScripts({ tx }: { tx: cardano.Tx }) {
  const redeemers = useMemo(() => tx.witnesses?.redeemers ?? [], [tx]);

  const [activeRedeemer, setActiveRedeemer] = useState<cardano.Redeemer | null>(
    () => redeemers[0] ?? null,
  );

  useEffect(() => {
    if (redeemers.length === 0) {
      setActiveRedeemer(null);
      return;
    }

    setActiveRedeemer((current) => {
      if (!current) return redeemers[0]!;
      const stillExists = redeemers.find(
        (r) => r.index === current.index && r.purpose === current.purpose,
      );
      return stillExists ?? redeemers[0]!;
    });
  }, [redeemers]);

  if (!activeRedeemer) {
    return (
      <Card className="h-full min-h-0 border border-default-200 shadow-none">
        <CardBody className="py-8 text-center text-sm text-gray-400">
          No scripts on this transaction.
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-0 border border-default-200 shadow-none">
      <CardBody className="flex h-full min-h-0 flex-col gap-6 p-6 md:flex-row">
        <div className="flex min-w-[200px] flex-col gap-2 border-r pr-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Redeemers
          </div>
          {redeemers.map((redeemer) => {
            const isActive =
              redeemer.purpose === activeRedeemer.purpose &&
              redeemer.index === activeRedeemer.index;
            return (
              <Button
                key={`${redeemer.purpose}-${redeemer.index}`}
                size="sm"
                variant={isActive ? "solid" : "ghost"}
                color={isActive ? "primary" : "default"}
                className="justify-start font-medium capitalize"
                onPress={() => setActiveRedeemer(redeemer)}
              >
                {formatPurpose(redeemer.purpose)} #{redeemer.index}
              </Button>
            );
          })}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto content-start items-start md:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Script Hash"
            value={formatHash(activeRedeemer.scriptHash)}
          />
          <DetailItem
            label="Redeemer Data Hash"
            value={formatHash(activeRedeemer.redeemerDataHash)}
          />
          <DetailItem
            label="Purpose"
            value={formatPurpose(activeRedeemer.purpose)}
          />
          <DetailItem
            label="Mem"
            value={formatNumber(activeRedeemer.unitMem)}
          />
          <DetailItem
            label="CPU"
            value={formatNumber(activeRedeemer.unitSteps)}
          />
          <DetailItem label="Fee" value={formatNumber(activeRedeemer.fee)} />
        </div>
      </CardBody>
    </Card>
  );
}
