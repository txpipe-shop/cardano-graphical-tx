"use client";

import { Button, Card, CardBody, Code } from "@heroui/react";
import {
  DatumType,
  type cardano,
  type Datum,
  type OutRef,
} from "@laceanatomy/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCborDiagnostic } from "~/app/_hooks/useCborDiagnostic";
import CopyButton from "../CopyButton";

interface DatumItem {
  ref: OutRef;
  datum: Datum;
}

export default function TxDatum({ tx }: { tx: cardano.Tx }) {
  const searchParams = useSearchParams();
  const datumRefParam = searchParams.get("txOutRef");
  const inputsWithDatum = useMemo(
    () =>
      tx.inputs
        .filter((i) => i.datum)
        .map((utxo) => ({ ref: utxo.outRef, datum: utxo.datum! })),
    [tx.inputs],
  );

  const outputsWithDatum = useMemo(
    () =>
      tx.outputs
        .filter((o) => o.datum)
        .map((utxo) => ({ ref: utxo.outRef, datum: utxo.datum! })),
    [tx.outputs],
  );

  const parsedRef = useMemo(() => {
    if (!datumRefParam) return null;
    const [hash, indexRaw] = datumRefParam.split("#");
    if (!hash || !indexRaw) return null;
    try {
      return { hash, index: BigInt(indexRaw) };
    } catch {
      return null;
    }
  }, [datumRefParam]);

  const matchedDatum = useMemo(() => {
    if (!parsedRef) return null;
    const all = [...inputsWithDatum, ...outputsWithDatum];
    return (
      all.find(
        (item) =>
          item.ref.hash === parsedRef.hash &&
          item.ref.index === parsedRef.index,
      ) ?? null
    );
  }, [inputsWithDatum, outputsWithDatum, parsedRef]);

  const [activeTab, setActiveTab] = useState<DatumItem | null>(
    matchedDatum ?? inputsWithDatum[0] ?? outputsWithDatum[0] ?? null,
  );

  useEffect(() => {
    if (!matchedDatum) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab(matchedDatum);
  }, [matchedDatum]);

  const activeCbor =
    activeTab?.datum?.type === DatumType.INLINE && activeTab.datum.datumHex
      ? activeTab.datum.datumHex
      : "";
  const { diagnosticText } = useCborDiagnostic(activeCbor);

  if (!activeTab) {
    return (
      <Card className="h-full min-h-0 border border-border shadow-none bg-surface">
        <CardBody className="py-8 text-center text-sm text-p-secondary">
          No inputs or outputs with datum in this transaction.
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="h-full min-h-0 border border-border shadow-none bg-surface">
      <CardBody className="flex h-full min-h-0 flex-col gap-6 p-6 md:flex-row">
        {/* Sidebar Tabs */}
        <div className="flex min-w-[200px] flex-col gap-4 border-r pr-4">
          {inputsWithDatum.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="font-bold text-sm text-p-secondary uppercase tracking-wider">
                Inputs with Datum
              </div>
              {inputsWithDatum.map((item) => {
                const isActive =
                  activeTab.ref.hash === item.ref.hash &&
                  activeTab.ref.index === item.ref.index;
                return (
                  <Button
                    key={`${item.ref.hash}#${item.ref.index}`}
                    size="sm"
                    variant={isActive ? "solid" : "ghost"}
                    color={isActive ? "primary" : "default"}
                    className="justify-start font-mono text-xs"
                    onPress={() => setActiveTab(item)}
                  >
                    {item.ref.hash.slice(0, 10)}...#{item.ref.index.toString()}
                  </Button>
                );
              })}
            </div>
          )}

          {outputsWithDatum.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="font-bold text-sm text-p-secondary uppercase tracking-wider">
                Outputs with Datum
              </div>
              {outputsWithDatum.map((item) => {
                const isActive =
                  activeTab.ref.hash === item.ref.hash &&
                  activeTab.ref.index === item.ref.index;
                return (
                  <Button
                    key={`${item.ref.hash}#${item.ref.index.toString()}`}
                    size="sm"
                    variant={isActive ? "solid" : "ghost"}
                    color={isActive ? "primary" : "default"}
                    className="justify-start font-mono text-xs"
                    onPress={() => setActiveTab(item)}
                  >
                    {item.ref.hash.slice(0, 10)}...#{item.ref.index.toString()}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-p-secondary">Datum Type:</span>
            <span className="bg-surface px-2 py-1 rounded text-sm font-mono">
              {activeTab.datum.type === DatumType.HASH ? "Hash" : "Inline"}
            </span>
          </div>

          {activeTab.datum.type === DatumType.HASH && (
            <div>
              <div className="font-semibold text-p-secondary mb-2">
                Datum Hash:
              </div>
              <Code className="block w-full whitespace-pre-wrap break-all p-4">
                {activeTab.datum.datumHashHex ?? "No hash"}
                <div className="mt-2 inline-block">
                  <CopyButton
                    text={activeTab.datum.datumHashHex ?? ""}
                    size={14}
                  />
                </div>
              </Code>
            </div>
          )}

          {activeTab.datum.type === DatumType.INLINE && (
            <>
              <div>
                <div className="font-semibold text-p-secondary mb-2">
                  INLINE DATUM (Hex):
                </div>
                <Code className="block w-full whitespace-pre-wrap break-all bg-surface p-4">
                  {activeTab.datum.datumHex ?? "No CBOR"}
                </Code>
              </div>

              <div>
                <div className="font-semibold text-gray-700 mb-2">
                  Diagnostic:
                </div>
                <Code className="block max-h-[400px] w-full overflow-y-auto whitespace-pre-wrap bg-surface p-4">
                  {diagnosticText || "No diagnostic"}
                </Code>
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
