"use client";

import { Button } from "@heroui/react";
import { type cardano } from "@laceanatomy/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGraphical } from "~/app/_contexts";
import { type ITransaction } from "~/app/_interfaces";
import { type Network, ROUTES, type TxTab } from "~/app/_utils";
import { DetailTabs } from "../../DetailTabs";
import { DissectSection } from "../../DissectSection/DissectSection";
import { Playground } from "../../GraphicalSection";
import {
  parseTxToGraphical,
  setITransaction,
} from "../../Input/TxInput/txInput.helper";
import TxCbor from "./TxCbor";
import TxDatum from "./TxDatum";
import TxOverview from "./TxOverview";
import TxScripts from "./TxScripts";

interface TxTabsProps {
  tx: ITransaction;
  cardanoTx: cardano.Tx;
  cbor: string;
  chain: Network;
  tab: TxTab;
}

export default function TxTabs({
  tx,
  cardanoTx,
  cbor: initialCbor,
  tab: initialTab,
  chain,
}: TxTabsProps) {
  const [active, setActive] = useState<TxTab>(initialTab);
  const { setTransactionBox, dimensions } = useGraphical();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    setITransaction(
      [tx],
      { transactions: [], utxos: {} },
      setTransactionBox,
      () => {},
      () => {},
      { x: dimensions.width, y: dimensions.height },
    );
  }, [setTransactionBox, dimensions.width, dimensions.height, tx]);

  const tabs = [
    {
      key: "Overview",
      title: "Overview",
      content: <TxOverview tx={cardanoTx} />,
    },
    {
      key: "Diagram",
      title: "Diagram",
      content: (
        <div className="relative h-[40vh] w-full overflow-hidden rounded-lg md:h-[60vh]">
          <Button
            as={Link}
            size="sm"
            variant="flat"
            className="absolute right-4 top-4 z-10 font-mono text-p-primary shadow-md bg-surface"
            href={`${ROUTES.GRAPHER}?hash=${tx.txHash}&net=${chain}`}
            target="_blank"
          >
            Playground
          </Button>
          <div className="h-full w-full">
            <Playground fillMode="parent" />
          </div>
        </div>
      ),
    },
    {
      key: "Dissect",
      title: "Dissect",
      content: (
        <div className="overflow-visible">
          <DissectSection
            tx={parseTxToGraphical([tx], { transactions: [], utxos: {} })[0]!}
          />
        </div>
      ),
    },
    {
      key: "CBOR",
      title: "CBOR",
      content: (
        <div className="flex-1 min-h-0">
          <TxCbor cbor={initialCbor} />
        </div>
      ),
    },
    {
      key: "Datum",
      title: "Datum",
      content: (
        <div className="flex-1 min-h-0 overflow-auto">
          <TxDatum tx={cardanoTx} />
        </div>
      ),
    },
    {
      key: "Scripts",
      title: "Scripts",
      content: (
        <div className="flex-1 min-h-0 overflow-auto">
          <TxScripts tx={cardanoTx} />
        </div>
      ),
    },
  ];

  return (
    <DetailTabs
      tabs={tabs}
      defaultTab="Overview"
      activeTab={active}
      onTabChange={(key) => setActive(key as TxTab)}
      ariaLabel="Transaction details"
    />
  );
}
