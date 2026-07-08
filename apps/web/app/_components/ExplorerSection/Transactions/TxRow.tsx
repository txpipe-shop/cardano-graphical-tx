"use client";
import { Button, Card, CardBody } from "@heroui/react";
import type { cardano, Unit } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import Link from "next/link";
import { SubLabel } from "~/app/_components/SubLabel";
import { ROUTES } from "~/app/_utils";
import { formatAda } from "~/app/_utils/explorer";
import ColoredAddress from "../ColoredAddress";
import CopyButton from "../CopyButton";
import DateViewer from "../DateViewer";
import ClockIcon from "../Icons/ClockIcon";
import TokenPill from "../TokenPill";

interface TxRowHeaderProps {
  tx: cardano.Tx;
  chain: Network;
}

function TxRowHeader({ tx, chain }: TxRowHeaderProps) {
  return (
    <div className="flex flex-col gap-3 bg-explorer-row p-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.EXPLORER_TX(chain, tx.hash)}
          className="break-all font-mono text-sm text-accent-blue hover:underline"
        >
          {tx.hash}
        </Link>
        <CopyButton text={tx.hash} size={14} />
      </div>

      <div className="flex items-center gap-2 text-sm text-p-secondary">
        <ClockIcon size={14} />
        <DateViewer timestamp={tx.createdAt} className="text-p-secondary" />
      </div>

      <div className="text-sm font-medium">Fee: {formatAda(tx.fee)}</div>

      <div className="flex gap-2">
        <Button
          as={Link}
          size="sm"
          variant="flat"
          className="font-mono shadow-md"
          href={`${ROUTES.DISSECT}?hash=${tx.hash}&net=${chain}`}
          target="_blank"
        >
          Dissect
        </Button>
        <Button
          as={Link}
          size="sm"
          variant="flat"
          className="font-mono shadow-md"
          href={`${ROUTES.GRAPHER}?hash=${tx.hash}&net=${chain}`}
          target="_blank"
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
  chain: Network;
  highlightAddress?: cardano.UTxO["address"];
}

function UTxOsColumn({
  tx,
  column,
  chain,
  highlightAddress,
}: Readonly<UTxOsColumnProps>) {
  const utxos = column === "inputs" ? tx.inputs : tx.outputs;

  const title =
    column === "inputs"
      ? `Inputs (${tx.inputs.length})`
      : `Outputs (${tx.outputs.length})`;

  return (
    <div>
      <h4 className="semibold mb-2 text-sm text-p-secondary">{title}</h4>
      <div className="space-y-2">
        {utxos.map((utxo) => (
          <div
            className={`rounded-lg bg-explorer-row p-2 ${
              highlightAddress !== undefined &&
              utxo.address === highlightAddress
                ? "ring-1 ring-accent-blue"
                : ""
            }`}
            key={`${utxo.outRef.hash}#${utxo.outRef.index.toString()}`}
          >
            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
              <span className="text-sm font-medium">
                {formatAda(utxo.coin)}
              </span>
              <ColoredAddress address={utxo.address} chain={chain} />
              <div className="flex items-center gap-1">
                <SubLabel className="font-mono">
                  {utxo.outRef.hash.slice(0, 7)}...{utxo.outRef.hash.slice(-7)}#
                  {utxo.outRef.index.toString()}
                </SubLabel>
                <CopyButton
                  size={12}
                  text={`${utxo.outRef.hash}#${utxo.outRef.index}`}
                />
              </div>
            </div>
            {Object.keys(utxo.value).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.entries(utxo.value).map(([unit, amount]) => (
                  <TokenPill
                    key={unit}
                    unit={unit as Unit}
                    amount={amount}
                    mint={tx.mint}
                    chain={chain}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TxRow({
  tx,
  chain,
  highlightAddress,
}: Readonly<{
  tx: cardano.Tx;
  chain: Network;
  highlightAddress?: cardano.UTxO["address"];
}>) {
  return (
    <Card className="mb-4 border-2 border-dashed border-border shadow-md bg-background">
      <CardBody className="p-0">
        <TxRowHeader tx={tx} chain={chain} />
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <UTxOsColumn
            tx={tx}
            column="inputs"
            chain={chain}
            highlightAddress={highlightAddress}
          />
          <UTxOsColumn
            tx={tx}
            column="outputs"
            chain={chain}
            highlightAddress={highlightAddress}
          />
        </div>
      </CardBody>
    </Card>
  );
}
