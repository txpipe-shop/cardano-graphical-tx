"use client";

import { Hash } from "@laceanatomy/types";
import { NETWORK } from "@laceanatomy/types/cardano";
import { useEffect, useMemo, useState } from "react";
import { DevnetError } from "~/app/_components/DevnetError";
import { DevnetLoadingCard } from "~/app/_components/DevnetLoadingCard";
import TxTabs from "~/app/_components/ExplorerSection/Transactions/TxTabs";
import { useConfigs } from "~/app/_contexts";
import {
  getTxFromDevnetCBOR,
  resolveDevnetPort,
  type TxTab,
} from "~/app/_utils";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";
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
    return <DevnetLoadingCard message="Loading transaction..." />;
  }

  if (error || !data) {
    return (
      <DevnetError
        className="w-full"
        title="Transaction not found or could not be loaded."
        error={error}
      />
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
