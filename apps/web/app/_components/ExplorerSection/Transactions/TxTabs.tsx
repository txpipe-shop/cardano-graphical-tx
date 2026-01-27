"use client";

import { Button, Tab, Tabs } from "@heroui/react";
import { type cardano } from "@laceanatomy/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGraphical } from "~/app/_contexts";
import { type ITransaction } from "~/app/_interfaces";
import { type Network, ROUTES, type TxTab } from "~/app/_utils";
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

  return (
    <div className="flex min-h-0 w-full flex-col space-y-4">
      <Tabs
        aria-label="Transaction details"
        selectedKey={active}
        onSelectionChange={(key) => setActive(key as TxTab)}
        variant="light"
        classNames={{
          tabList: "w-full",
          tab: "px-3 py-1 rounded border bg-gray-200 h-full",
          tabContent: "text-black text-sm font-medium",
          panel: "flex min-h-0 flex-1 flex-col p-0",
        }}
      >
        <Tab key="Overview" title="Overview">
          <TxOverview tx={cardanoTx} />
        </Tab>

        <Tab key="Diagram" title="Diagram">
          <div className="relative h-[60vh] w-full overflow-hidden rounded-lg border">
            <Button
              as={Link}
              size="sm"
              variant="flat"
              className="absolute right-4 top-4 z-10 font-mono text-black shadow-md bg-white"
              href={`${ROUTES.GRAPHER}?hash=${tx.txHash}&net=${chain}`}
              target="_blank"
            >
              Playground
            </Button>
            <div className="h-full w-full">
              <Playground fillMode="parent" />
            </div>
          </div>
        </Tab>

        <Tab key="Dissect" title="Dissect">
          <div className="overflow-visible">
            <DissectSection
              tx={parseTxToGraphical([tx], { transactions: [], utxos: {} })[0]!}
            />
          </div>
        </Tab>

        <Tab key="CBOR" title="CBOR">
          <div className="flex-1 min-h-0">
            <TxCbor cbor={initialCbor} />
          </div>
        </Tab>

        <Tab key="Datum" title="Datum">
          <div className="flex-1 min-h-0 overflow-auto">
            <TxDatum tx={cardanoTx} />
          </div>
        </Tab>

        <Tab key="Scripts" title="Scripts">
          <div className="flex-1 min-h-0 overflow-auto">
            <TxScripts tx={cardanoTx} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
