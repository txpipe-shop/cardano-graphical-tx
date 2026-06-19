"use client";

import { Card, CardBody } from "@heroui/react";
import { type cardano, type Unit } from "@laceanatomy/types";
import { useEffect, useState } from "react";
import TokenTabs from "~/app/_components/ExplorerSection/Tokens/TokenTabs";
import { useConfigs } from "~/app/_contexts";
import {
  getU5CProviderWeb,
  NETWORK,
  resolveDevnetPort,
  type TokenTab,
} from "~/app/_utils";
import type { TokenPageData } from "./_shared";

interface DevnetTokenTabsProps {
  unit: string;
  tab: TokenTab;
  page: number;
}

export default function DevnetTokenTabs({
  unit,
  tab,
  page,
}: DevnetTokenTabsProps) {
  const { configs } = useConfigs();
  const port = resolveDevnetPort(configs.port);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TokenPageData | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const provider = getU5CProviderWeb(port);
        const rawUnit = unit.startsWith("0x") ? unit.slice(2) : unit;

        const info: TokenPageData["assetInfo"] = {
          unit: rawUnit,
          policyId: rawUnit.length >= 56 ? rawUnit.slice(0, 56) : "",
          assetNameHex: rawUnit.length > 56 ? rawUnit.slice(56) : "",
          fingerprint: "",
          totalSupply: "0",
          mintOrBurnCount: 0,
          initialMintTxHash: "",
          metadata: {
            subject: rawUnit,
            name: null,
            description: null,
            ticker: null,
            url: null,
            logo: null,
            decimals: null,
            policy: null,
          },
          onchainMetadata: null,
          onchainMetadataStandard: null,
          metadataSource: "none",
        };

        const tx = await provider.getLatestTx();
        const matchingOutputs: { address: string; amount: bigint }[] = [];

        for (const output of tx.outputs) {
          const amount = output.value[rawUnit as Unit];
          if (amount !== undefined && amount > 0n) {
            matchingOutputs.push({ address: output.address, amount });
          }
        }

        let totalSupply = 0n;
        for (const [mintUnit, mintAmount] of Object.entries(tx.mint)) {
          if (mintUnit === rawUnit) {
            totalSupply += mintAmount;
          }
        }

        const holderMap = new Map<string, bigint>();
        for (const mo of matchingOutputs) {
          const existing = holderMap.get(mo.address) ?? 0n;
          holderMap.set(mo.address, existing + mo.amount);
        }

        const total = totalSupply > 0n ? totalSupply.toString() : "0";

        if (!isActive) return;

        const pageData: TokenPageData = {
          assetInfo: { ...info, totalSupply: total },
          addresses: Array.from(holderMap.entries()).map(([address, qty]) => ({
            address,
            quantity: qty.toString(),
          })),
          addressesTotal: holderMap.size,
          history: [],
          historyTotal: 0,
          transactions: [] as cardano.Tx[],
          transactionsTotal: 0,
        };

        setData(pageData);
      } catch (err) {
        if (!isActive) return;
        console.error("Failed to load devnet token:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [unit, port]);

  if (loading) {
    return (
      <Card className="w-full border-2 border-dashed border-border shadow-md bg-surface">
        <CardBody className="py-8 text-center text-p-secondary">
          Loading token...
        </CardBody>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
        <p className="font-semibold">Token not found or could not be loaded.</p>
        {error ? <p className="mt-2 text-sm">{error}</p> : null}
      </div>
    );
  }

  return <TokenTabs data={data} tab={tab} chain={NETWORK.DEVNET} page={page} />;
}
