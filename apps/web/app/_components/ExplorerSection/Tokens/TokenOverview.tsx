"use client";

import { Accordion, AccordionItem, Chip, Divider } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { JSONBIG, ROUTES } from "~/app/_utils/constants";
import { type Network } from "~/app/_utils/network-config";
import type { AssetInfo } from "~/app/explorer/[chain]/tokens/[unit]/_shared";

interface TokenOverviewProps {
  assetInfo: AssetInfo;
  chain: Network;
  holdersCount?: number | null;
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
    case "cip68":
      return "CIP-68";
    case "blockfrost-onchain":
      return "On-chain";
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
    case "cip68":
      return "success";
    case "blockfrost-onchain":
      return "warning";
    case "none":
      return "default";
  }
}

function onchainStandardLabel(standard: string | null): string | null {
  if (!standard) return null;
  if (standard.startsWith("CIP25")) return "CIP-25";
  if (standard.startsWith("CIP68")) return "CIP-68";
  return standard;
}

function normalizeLogoUrl(logo: string): string {
  if (logo.startsWith("data:") || logo.startsWith("http")) return logo;
  return `data:image/png;base64,${logo}`;
}

export default function TokenOverview({
  assetInfo,
  chain,
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
  const logo = assetInfo.metadata?.logo
    ? normalizeLogoUrl(assetInfo.metadata.logo)
    : null;

  const source = assetInfo.metadataSource;
  const onchainStandard = onchainStandardLabel(
    assetInfo.onchainMetadataStandard,
  );

  const sourceLink =
    source === "cip68" && assetInfo.cip68ReferenceUtxo
      ? ROUTES.EXPLORER_TX(chain, assetInfo.cip68ReferenceUtxo.txHash)
      : assetInfo.initialMintTxHash
        ? ROUTES.EXPLORER_TX(chain, assetInfo.initialMintTxHash)
        : null;

  const hasRawCip68 = assetInfo.cip68Metadata !== null;
  const hasRawOnchain = assetInfo.onchainMetadata !== null;
  const hasRawRegistry = assetInfo.rawRegistryMetadata !== null;
  const hasAnyRaw = hasRawCip68 || hasRawOnchain || hasRawRegistry;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {logo ? (
            <Image
              src={logo}
              alt={displayName}
              width={36}
              height={36}
              className="rounded-full shrink-0 object-cover"
              unoptimized
            />
          ) : null}
          <h1 className="text-2xl font-bold text-p-primary">{displayName}</h1>
          {ticker ? (
            <Chip size="sm" variant="flat" color="primary">
              {ticker}
            </Chip>
          ) : null}
          <Chip size="sm" variant="flat" color={metadataSourceColor(source)}>
            {metadataSourceLabel(source)}
            {source !== "none" && onchainStandard
              ? ` (${onchainStandard})`
              : ""}
          </Chip>
          {sourceLink ? (
            <Link
              href={sourceLink}
              className="text-xs text-accent-blue hover:underline"
            >
              {source === "cip68" ? "Reference UTxO" : "Minting tx"}
            </Link>
          ) : null}
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
            {holdersCount === null
              ? "20+"
              : holdersCount !== undefined
                ? holdersCount.toLocaleString()
                : "—"}
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

      {hasAnyRaw ? (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-p-secondary">
              Raw Metadata
            </span>
            <Accordion
              selectionMode="multiple"
              variant="splitted"
              className="px-0"
            >
              {hasRawCip68 ? (
                <AccordionItem
                  key="cip68"
                  aria-label="Raw CIP-68 Metadata"
                  title="CIP-68 Metadata"
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(assetInfo.cip68Metadata, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
              {hasRawOnchain ? (
                <AccordionItem
                  key="onchain"
                  aria-label="Raw On-chain Metadata"
                  title={`On-chain Metadata${assetInfo.onchainMetadataStandard ? ` (${assetInfo.onchainMetadataStandard})` : ""}`}
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(assetInfo.onchainMetadata, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
              {hasRawRegistry ? (
                <AccordionItem
                  key="registry"
                  aria-label="Raw Registry Metadata"
                  title="Cardano Token Registry"
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(assetInfo.rawRegistryMetadata, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
            </Accordion>
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
    </>
  );
}
