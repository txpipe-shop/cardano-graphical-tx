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
    <div className="space-y-4">
      <div className="flex gap-2 border-b pb-2">
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

      {active === "Overview" && <TxOverview tx={cardanoTx} />}

      {active === "CBOR" && <TxCbor cbor={initialCbor} />}

      {active === "Dissect" && (
        <div>
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

      {active === "Datum" && <TxDatum tx={cardanoTx} />}

      {active === "Scripts" && <TxScripts tx={cardanoTx} />}
    </div>
  );
}
