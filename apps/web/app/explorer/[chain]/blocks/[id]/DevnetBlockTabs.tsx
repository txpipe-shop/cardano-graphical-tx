"use client";

import { NETWORK } from "@laceanatomy/types/cardano";
import { useEffect, useMemo, useState } from "react";
import { DevnetError } from "~/app/_components/DevnetError";
import { DevnetLoadingCard } from "~/app/_components/DevnetLoadingCard";
import BlockTabs from "~/app/_components/ExplorerSection/Blocks/BlockTabs";
import { useConfigs } from "~/app/_contexts";
import { resolveDevnetPort, type BlockTab } from "~/app/_utils";
import { resolveBlockReq } from "~/app/_utils/block";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";

interface DevnetBlockTabsProps {
  id: string;
  tab: BlockTab;
  txPage: number;
}

export default function DevnetBlockTabs({
  id,
  tab,
  txPage,
}: DevnetBlockTabsProps) {
  const { configs } = useConfigs();
  const port = resolveDevnetPort(configs.port);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    block: Awaited<
      ReturnType<ReturnType<typeof getU5CProviderWeb>["getBlock"]>
    >;
    transactions: Awaited<
      ReturnType<ReturnType<typeof getU5CProviderWeb>["getTxs"]>
    >["data"];
    cbor: string | null;
  } | null>(null);

  const blockReq = useMemo(() => resolveBlockReq(id), [id]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!blockReq) {
          throw new Error("Invalid block identifier");
        }

        const provider = getU5CProviderWeb(port);
        const block = await provider.getBlock(blockReq);
        const txsResult = await provider.getTxs({
          limit: block.txCount,
          offset: 0n,
          query: { block: blockReq },
        });
        let cbor: string | null = null;
        try {
          cbor = await provider.getBlockCBOR(blockReq);
        } catch {
          // CBOR may not be available
        }

        if (!isActive) return;
        setData({ block, transactions: txsResult.data, cbor });
      } catch (err) {
        if (!isActive) return;
        console.error("Failed to load devnet block:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [blockReq, port]);

  if (loading) {
    return <DevnetLoadingCard message="Loading block..." />;
  }

  if (error || !data) {
    return (
      <DevnetError
        className="w-full"
        title="Block not found or could not be loaded."
        error={error}
      />
    );
  }

  return (
    <BlockTabs
      block={data.block}
      transactions={data.transactions}
      cbor={data.cbor}
      chain={NETWORK.DEVNET}
      tab={tab}
      txPage={txPage}
    />
  );
}
