"use client";
import { Button, Card, CardBody } from "@heroui/react";
import type { cardano, Unit } from "@laceanatomy/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatSeconds } from "~/app/_utils/explorer";
import ColoredAddress from "../ColoredAddress";
import CopyButton from "../CopyButton";
import ClockIcon from "../Icons/ClockIcon";
import TokenPill from "../TokenPill";

interface TxRowHeaderProps {
  tx: cardano.Tx;
  chain: string;
}

function TxRowHeader({ tx, chain }: TxRowHeaderProps) {
  const router = useRouter();
  const handleDissect = () => {
    router.push(`/tx/dissect?tx=${tx.hash}&chain=${chain}`);
  };

  const handleDraw = () => {
    router.push(`/tx/grapher?tx=${tx.hash}&chain=${chain}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-violet-100 p-4">
      {/* Transaction Hash */}
      <div className="flex items-center gap-2">
        <Link
          href={`/tx/dissect?tx=${tx.hash}&chain=${chain}`}
          className="font-mono text-sm text-blue-600 hover:underline"
        >
          {tx.hash}
        </Link>
        <CopyButton text={tx.hash} size={14} />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <ClockIcon size={14} />
        {formatSeconds(tx.createdAt)}
      </div>

      <div className="text-sm font-medium">
        Fee: {(Number(tx.fee) / 1_000_000).toFixed(6)} ₳
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="flat"
          className="font-mono shadow-md"
          onPress={handleDissect}
        >
          Dissect
        </Button>
        <Button
          size="sm"
          variant="flat"
          className="font-mono shadow-md"
          onPress={handleDraw}
        >
          Draw
        </Button>
      </div>
    </div>
  );
}

interface UTxOsColumnProps {
  tx: cardano.Tx;
  column: "inputs" | "outputs";
}

function UTxOsColumn({ tx, column }: UTxOsColumnProps) {
  const utxos = column === "inputs" ? tx.inputs : tx.outputs;

  const title =
    column === "inputs"
      ? `Inputs (${tx.inputs.length})`
      : `Outputs (${tx.outputs.length})`;

  return (
    <div>
      <h4 className="semibold mb-2 text-sm text-gray-500">{title}</h4>
      <div className="space-y-2">
        {utxos.map((utxo, i) => (
          <div className="rounded-lg bg-gray-100 p-2" key={i}>
            <div className="flex items-center gap-2">
              {(Number(utxo.coin) / 1_000_000).toFixed(6)} ₳
              <ColoredAddress address={utxo.address} />
            </div>
            {Object.keys(utxo.value).length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="text-xs font-semibold uppercase text-gray-400">
                  Tokens
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(utxo.value).map(([unit, amount]) => (
                    <TokenPill
                      key={unit}
                      unit={unit as Unit}
                      amount={amount}
                      mint={tx.mint}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TxRow({ tx, chain }: { tx: cardano.Tx; chain: string }) {
  return (
    <Card className="mb-4 border-2 border-dashed border-gray-200 shadow-md">
      <CardBody className="p-0">
        {/* Header Row */}
        <TxRowHeader tx={tx} chain={chain} />

        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <UTxOsColumn tx={tx} column="inputs" />
          <UTxOsColumn tx={tx} column="outputs" />
        </div>
      </CardBody>
    </Card>
  );
}
