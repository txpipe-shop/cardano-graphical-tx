"use client";

import { Card, CardBody } from "@heroui/react";
import { Hash } from "@laceanatomy/types";
import { useEffect, useMemo, useState } from "react";
import TxTabs from "~/app/_components/ExplorerSection/Transactions/TxTabs";
import { useConfigs } from "~/app/_contexts";
import {
  getTxFromDevnetCBOR,
  getU5CProviderWeb,
  NETWORK,
  resolveDevnetPort,
  type TxTab,
} from "~/app/_utils";
import { loadTxPageData } from "./_shared";

interface DevnetTxTabsProps {
  hash: string;
  tab: TxTab;
}

export default function DevnetTxTabs({ hash, tab }: DevnetTxTabsProps) {
  const { configs } = useConfigs();
  const port = resolveDevnetPort(configs.port);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof loadTxPageData>
  > | null>(null);

  const hashValue = useMemo(() => Hash(hash), [hash]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const provider = getU5CProviderWeb(port);
        const parseCborViaApi = async (cbor: string) => {
          try {
            return (await getTxFromDevnetCBOR(cbor)).tx;
          } catch {
            throw new Error("Failed to parse CBOR from devnet transaction");
          }
        };

        const result = await loadTxPageData(
          provider,
          hashValue,
          parseCborViaApi,
          NETWORK.DEVNET,
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
      <Card className="w-full border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          Loading transaction...
        </CardBody>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
        <p className="font-semibold">
          Transaction not found or could not be loaded.
        </p>
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
      chain={NETWORK.DEVNET}
    />
  );
}
