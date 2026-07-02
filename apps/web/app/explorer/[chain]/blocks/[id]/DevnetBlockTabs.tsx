"use client";

import { Card, CardBody } from "@heroui/react";
import { Hash } from "@laceanatomy/types";
import { useEffect, useMemo, useState } from "react";
import BlockTabs from "~/app/_components/ExplorerSection/Blocks/BlockTabs";
import { useConfigs } from "~/app/_contexts";
import { NETWORK, resolveDevnetPort, type BlockTab } from "~/app/_utils";
import { getU5CProviderWeb } from "~/app/_utils/u5c-provider-web";

interface DevnetBlockTabsProps {
  id: string;
  tab: BlockTab;
  txPage: number;
}

function resolveBlockReq(
  id: string,
): { hash: Hash } | { height: bigint } | null {
  if (/^[0-9a-fA-F]{64}$/.test(id)) {
    return { hash: Hash(id) };
  }
  if (/^\d+$/.test(id)) {
    return { height: BigInt(id) };
  }
  return null;
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
    return (
      <Card className="w-full border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          Loading block...
        </CardBody>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
        <p className="font-semibold">Block not found or could not be loaded.</p>
        {error ? <p className="mt-2 text-sm">{error}</p> : null}
      </div>
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
