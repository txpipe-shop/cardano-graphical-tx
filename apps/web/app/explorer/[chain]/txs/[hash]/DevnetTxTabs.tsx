"use client";

import { Hash } from "@laceanatomy/types";
import { useEffect, useMemo, useState } from "react";
import TxTabs from "~/app/_components/ExplorerSection/Transactions/TxTabs";
import { useConfigs } from "~/app/_contexts";
import { DEFAULT_DEVNET_PORT } from "~/app/_utils";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";
import { loadTxPageData } from "./_shared";

const TABS = [
  "Overview",
  "Diagram",
  "Dissect",
  "CBOR",
  "Datum",
  "Scripts",
] as const;
type TxTab = (typeof TABS)[number];

interface DevnetTxTabsProps {
  hash: string;
  tab: TxTab;
}

function resolveDevnetPort(port: string | undefined) {
  const fallback = Number.parseInt(DEFAULT_DEVNET_PORT, 10);
  if (!port) return fallback;
  const value = Number.parseInt(port, 10);
  if (Number.isNaN(value) || value <= 0 || value > 65535) return fallback;
  return value;
}

export default function DevnetTxTabs({ hash, tab }: DevnetTxTabsProps) {
  const { configs } = useConfigs();
  const port = resolveDevnetPort(configs.port);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<
    Awaited<ReturnType<typeof loadTxPageData>> | null
  >(null);

  const hashValue = useMemo(() => Hash(hash), [hash]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const provider = getU5CProviderWeb(port);
        const parseCborViaApi = async (cbor: string) => {
          const formData = new FormData();
          formData.append("tx", cbor);

          const res = await fetch("/api/cbor/devnet", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error(res.statusText || "Failed to parse CBOR");
          }

          const data = await res.json();
          if (!data?.tx) {
            throw new Error("Transaction cbor could not be parsed");
          }

          return data.tx;
        };

        const result = await loadTxPageData(
          provider,
          hashValue,
          parseCborViaApi,
        );

        if (!isActive) return;
        setData(result);
      } catch (err) {
        if (!isActive) return;
        console.error("Failed to load devnet transaction:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [hashValue, port]);

  if (loading) {
    return (
      <div className="w-full rounded-lg border-2 border-dashed border-gray-200 p-8 text-center text-gray-600">
        Loading transaction...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-8 text-center text-red-600">
        <p className="font-semibold">Transaction not found or could not be loaded.</p>
        {error ? <p className="mt-2 text-sm">{error}</p> : null}
      </div>
    );
  }

  return (
    <TxTabs
      tx={data.tx}
      cardanoTx={data.cardanoTx}
      cbor={data.cbor}
      tab={tab}
    />
  );
}