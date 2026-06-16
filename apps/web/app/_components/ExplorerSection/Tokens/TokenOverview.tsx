"use client";

import { Card, CardBody, Chip, Divider } from "@heroui/react";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { type Network } from "~/app/_utils/network-config";
import type { AssetInfo } from "~/app/explorer/[chain]/tokens/[unit]/_shared";

interface TokenOverviewProps {
  assetInfo: AssetInfo;
  chain: Network;
  holdersCount?: number;
}

function formatQuantity(
  quantity: string,
  decimals: number | null | undefined,
): string {
  const q = BigInt(quantity);
  if (decimals == null || decimals === 0) return q.toLocaleString();
  const divisor = 10n ** BigInt(decimals);
  const integer = q / divisor;
  const fraction = q % divisor;
  const fractionStr = fraction.toString().padStart(decimals, "0");
  return `${integer.toLocaleString()}.${fractionStr}`;
}

function metadataSourceLabel(source: AssetInfo["metadataSource"]): string {
  switch (source) {
    case "token-registry":
      return "Cardano Token Registry";
    case "blockfrost-onchain":
      return "On-chain (CIP-25/CIP-68)";
    case "none":
      return "None";
  }
}

function metadataSourceColor(
  source: AssetInfo["metadataSource"],
): "success" | "warning" | "default" {
  switch (source) {
    case "token-registry":
      return "success";
    case "blockfrost-onchain":
      return "warning";
    case "none":
      return "default";
  }
}

export default function TokenOverview({
  assetInfo,
  chain: _chain,
  holdersCount,
}: TokenOverviewProps) {
  const displayName =
    assetInfo.metadata?.name ??
    (assetInfo.assetNameHex
      ? Buffer.from(assetInfo.assetNameHex, "hex").toString("ascii")
      : null) ??
    "Unknown Token";

  const ticker = assetInfo.metadata?.ticker;
  const decimals = assetInfo.metadata?.decimals;
  const description = assetInfo.metadata?.description;
  const url = assetInfo.metadata?.url;

  return (
    <Card className="w-full border border-border bg-surface shadow-md">
      <CardBody className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-p-primary">{displayName}</h1>
            {ticker ? (
              <Chip size="sm" variant="flat" color="primary">
                {ticker}
              </Chip>
            ) : null}
            <Chip
              size="sm"
              variant="flat"
              color={metadataSourceColor(assetInfo.metadataSource)}
            >
              {metadataSourceLabel(assetInfo.metadataSource)}
            </Chip>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-p-secondary">
            <span className="flex items-center gap-1">
              Policy:{" "}
              <span className="font-mono text-xs">
                {assetInfo.policyId.slice(0, 8)}...
                {assetInfo.policyId.slice(-8)}
              </span>
              <CopyButton text={assetInfo.policyId} size={12} />
            </span>
            <span className="flex items-center gap-1">
              Fingerprint:{" "}
              <span className="font-mono text-xs">{assetInfo.fingerprint}</span>
              <CopyButton text={assetInfo.fingerprint} size={12} />
            </span>
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col">
            <span className="text-xs text-p-secondary">Total Supply</span>
            <span className="text-lg font-semibold text-p-primary">
              {formatQuantity(assetInfo.totalSupply, decimals)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-p-secondary">Decimals</span>
            <span className="text-lg font-semibold text-p-primary">
              {decimals !== null ? decimals : "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-p-secondary">Holders</span>
            <span className="text-lg font-semibold text-p-primary">
              {holdersCount != null ? holdersCount.toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-p-secondary">Mint/Burn Events</span>
            <span className="text-lg font-semibold text-p-primary">
              {assetInfo.mintOrBurnCount}
            </span>
          </div>
        </div>

        {description || url ? (
          <>
            <Divider />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-p-secondary">
                Metadata
              </span>
              {description ? (
                <p className="text-sm text-p-primary">{description}</p>
              ) : null}
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-blue underline hover:opacity-80"
                >
                  {url}
                </a>
              ) : null}
            </div>
          </>
        ) : null}

        {assetInfo.onchainMetadataStandard ? (
          <div className="flex gap-2 text-xs text-p-secondary">
            <span>On-chain standard:</span>
            <Chip size="sm" variant="flat">
              {assetInfo.onchainMetadataStandard}
            </Chip>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
