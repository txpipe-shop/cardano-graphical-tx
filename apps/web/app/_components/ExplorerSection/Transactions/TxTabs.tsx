"use client";

import { type cardano } from "@laceanatomy/types";
import { useEffect, useState } from "react";
import { useGraphical } from "~/app/_contexts";
import { type ITransaction } from "~/app/_interfaces";
import { DissectSection } from "../../DissectSection/DissectSection";
import { Playground } from "../../GraphicalSection";
import {
  parseTxToGraphical,
  setITransaction,
} from "../../Input/TxInput/txInput.helper";
import { type ChainNetwork } from "../ChainSelector";
import TxCbor from "./TxCbor";
import TxDatum from "./TxDatum";
import TxOverview from "./TxOverview";
import TxScripts from "./TxScripts";

const TABS = [
  "Overview",
  "Diagram",
  "Dissect",
  "CBOR",
  "Datum",
  "Scripts",
] as const;
type Tabs = (typeof TABS)[number];
interface TxTabsProps {
  tx: ITransaction;
  cardanoTx: cardano.Tx;
  cbor: string;
  chain: ChainNetwork;
  tab: Tabs;
}

export default function TxTabs({
  tx,
  cardanoTx,
  cbor: initialCbor,
  chain,
  tab: initialTab,
}: TxTabsProps) {
  const [active, setActive] = useState<Tabs>(initialTab);
  const { setTransactionBox, dimensions } = useGraphical();
  const shouldFill = active !== "Overview" && active !== "Dissect";

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
    <div className={`flex w-full flex-col ${shouldFill ? "min-h-0 flex-1" : ""} space-y-4`}>
      <div className="flex flex-shrink-0 gap-2 border-b pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            className={`px-3 py-1 rounded hover:bg-violet-400 hover:text-white ${active === t ? "bg-violet-500 text-white" : "border"}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={`${shouldFill ? "flex flex-1 flex-col min-h-0" : ""}`}>
        {active === "Overview" && <TxOverview tx={cardanoTx} />}

        {active === "CBOR" && (
          <div className="flex-1 min-h-0">
            <TxCbor cbor={initialCbor} />
          </div>
        )}

        {active === "Dissect" && (
          <div className="overflow-visible">
            <DissectSection
              tx={parseTxToGraphical([tx], { transactions: [], utxos: {} })[0]!}
            />
          </div>
        )}

        {active === "Diagram" && (
          <div className="relative h-[60vh] w-full overflow-hidden rounded-lg border">
            <div className="h-full w-full">
              <Playground fillMode="parent" />
            </div>
          </div>
        )}

        {active === "Datum" && (
          <div className="flex-1 min-h-0 overflow-auto">
            <TxDatum tx={cardanoTx} />
          </div>
        )}

        {active === "Scripts" && (
          <div className="flex-1 min-h-0 overflow-auto">
            <TxScripts tx={cardanoTx} />
          </div>
        )}
      </div>
    </div>
  );
}
