"use client";

import { Button, Card, CardBody, Code } from "@heroui/react";
import {
  DatumType,
  type cardano,
  type Datum,
  type OutRef,
} from "@laceanatomy/types";
import * as cbor2 from "cbor2";
import { useEffect, useMemo, useState } from "react";
import CopyButton from "../CopyButton";

interface DatumItem {
  ref: OutRef;
  datum: Datum;
}

export default function TxDatum({ tx }: { tx: cardano.Tx }) {
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

  const [activeTab, setActiveTab] = useState<DatumItem | null>(() => {
    if (inputsWithDatum.length > 0) return inputsWithDatum[0]!;
    if (outputsWithDatum.length > 0) return outputsWithDatum[0]!;
    return null;
  });

  const [diagnostic, setDiagnostic] = useState("No diagnostic");

  useEffect(() => {
    if (
      activeTab?.datum?.type === DatumType.INLINE &&
      activeTab.datum.datumHex
    ) {
      try {
        const diag = cbor2.diagnose(activeTab.datum.datumHex);
        setDiagnostic(
          typeof diag === "string" ? diag : JSON.stringify(diag, null, 2),
        );
      } catch {
        setDiagnostic("Error parsing CBOR");
      }
    } else {
      setDiagnostic("No diagnostic");
    }
  }, [activeTab]);

  if (!activeTab) {
    return (
      <Card className="shadow-none border border-default-200">
        <CardBody className="text-center text-gray-400 text-sm py-8">
          No inputs or outputs with datum in this transaction.
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border border-default-200">
      <CardBody className="flex flex-col md:flex-row gap-6 p-6">
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-4 min-w-[200px] border-r pr-4">
          {inputsWithDatum.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="font-bold text-sm text-gray-500 uppercase tracking-wider">
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
                    {item.ref.hash.slice(0, 10)}...#{item.ref.index}
                  </Button>
                );
              })}
            </div>
          )}

          {outputsWithDatum.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="font-bold text-sm text-gray-500 uppercase tracking-wider">
                Outputs with Datum
              </div>
              {outputsWithDatum.map((item) => {
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
                    {item.ref.hash.slice(0, 10)}...#{item.ref.index}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Datum Type:</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
              {activeTab.datum.type === DatumType.HASH ? "Hash" : "Inline"}
            </span>
          </div>

          {activeTab.datum.type === DatumType.HASH && (
            <div>
              <div className="font-semibold text-gray-700 mb-2">
                Datum Hash:
              </div>
              <Code className="w-full whitespace-pre-wrap break-all p-4 block">
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
                <div className="font-semibold text-gray-700 mb-2">
                  INLINE DATUM (Hex):
                </div>
                <Code className="w-full whitespace-pre-wrap break-all p-4 block bg-gray-50">
                  {activeTab.datum.datumHex ?? "No CBOR"}
                </Code>
              </div>

              <div>
                <div className="font-semibold text-gray-700 mb-2">
                  Diagnostic:
                </div>
                <Code className="w-full whitespace-pre-wrap p-4 block bg-gray-50 max-h-[400px] overflow-y-auto">
                  {diagnostic}
                </Code>
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
