"use client";

import { Accordion, AccordionItem, Chip, Divider } from "@heroui/react";
import Image from "next/image";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { JSONBIG } from "~/app/_utils/constants";
import type { AssetInfo } from "~/app/explorer/[chain]/tokens/[unit]/_shared";

interface TokenOverviewProps {
  assetInfo: AssetInfo;
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

function metadataSourceLabel(source: string): string {
  switch (source) {
    case "token-registry":
      return "Cardano Token Registry";
    case "cip68":
      return "CIP-68";
    case "blockfrost-onchain":
      return "On-chain";
    default:
      return source;
  }
}

function metadataSourceColor(
  source: string,
): "success" | "warning" | "default" {
  switch (source) {
    case "token-registry":
      return "success";
    case "cip68":
      return "success";
    case "blockfrost-onchain":
      return "warning";
    default:
      return "default";
  }
}

function normalizeLogoUrl(logo: string): string {
  if (logo.startsWith("data:") || logo.startsWith("http")) return logo;
  return `data:image/png;base64,${logo}`;
}

export default function TokenOverview({
  assetInfo,
  holdersCount,
}: TokenOverviewProps) {
  const { metadata } = assetInfo;
  const cip26 = metadata.Cip26;
  const cip25 = metadata.Cip25v1 ?? metadata.Cip25v2;
  const cip68 =
    metadata.Cip68v4 ??
    metadata.Cip68v3 ??
    metadata.Cip68v2 ??
    metadata.Cip68v1;

  const displayName =
    cip26?.name ??
    cip25?.name ??
    (typeof cip68 === "object" && cip68 && "name" in cip68
      ? cip68.name
      : null) ??
    (assetInfo.assetNameHex
      ? Buffer.from(assetInfo.assetNameHex, "hex").toString("ascii")
      : null) ??
    "Unknown Token";

  const ticker =
    cip26?.ticker ??
    ("ticker" in (cip68 ?? {}) ? (cip68 as { ticker?: string }).ticker : null);
  const decimals =
    cip26?.decimals ??
    ("decimals" in (cip68 ?? {})
      ? (cip68 as { decimals?: number }).decimals
      : null);
  const description =
    cip26?.description ??
    cip25?.description ??
    ("description" in (cip68 ?? {})
      ? (cip68 as { description?: string }).description
      : null);
  const url =
    cip26?.url ??
    ("url" in (cip68 ?? {}) ? (cip68 as { url?: string }).url : null);
  const logoRaw =
    cip26?.logo ??
    (typeof cip25?.image === "string"
      ? cip25.image
      : Array.isArray(cip25?.image)
        ? cip25.image[0]
        : null) ??
    ("image" in (cip68 ?? {})
      ? (cip68 as { image?: string }).image
      : "logo" in (cip68 ?? {})
        ? (cip68 as { logo?: string }).logo
        : null);
  const logo = logoRaw ? normalizeLogoUrl(logoRaw) : null;

  const sources = assetInfo.metadataSources;
  const hasRaw = cip26 || cip25 || cip68;

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
          {sources.length > 0 ? (
            sources.map((src) => (
              <Chip
                key={src}
                size="sm"
                variant="flat"
                color={metadataSourceColor(src)}
              >
                {metadataSourceLabel(src)}
              </Chip>
            ))
          ) : (
            <></>
          )}
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
          {assetInfo.assetNameHex ? (
            <span className="flex items-center gap-1">
              Asset Name:{" "}
              <span className="font-mono text-xs">
                {assetInfo.assetNameHex.length > 24
                  ? `${assetInfo.assetNameHex.slice(0, 12)}...${assetInfo.assetNameHex.slice(-12)}`
                  : assetInfo.assetNameHex}
              </span>
              <CopyButton text={assetInfo.assetNameHex} size={12} />
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            Unit:{" "}
            <span className="font-mono text-xs">
              {assetInfo.unit.length > 32
                ? `${assetInfo.unit.slice(0, 16)}...${assetInfo.unit.slice(-16)}`
                : assetInfo.unit}
            </span>
            <CopyButton text={assetInfo.unit} size={12} />
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
            {decimals !== null && decimals !== undefined ? decimals : "N/A"}
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

      {hasRaw ? (
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
              {cip26 ? (
                <AccordionItem
                  key="cip26"
                  aria-label="Raw CIP-26 Metadata"
                  title="CIP-26 (Token Registry)"
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(cip26, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
              {cip25 ? (
                <AccordionItem
                  key="cip25"
                  aria-label="Raw CIP-25 Metadata"
                  title={`CIP-25 (${metadata.Cip25v2 ? "v2" : "v1"})`}
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(cip25, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
              {metadata.Cip68v4 ? (
                <AccordionItem
                  key="cip68v4"
                  aria-label="Raw CIP-68v4 Metadata"
                  title="CIP-68 (v4)"
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(metadata.Cip68v4, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
              {metadata.Cip68v3 ? (
                <AccordionItem
                  key="cip68v3"
                  aria-label="Raw CIP-68v3 Metadata"
                  title="CIP-68 (v3)"
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(metadata.Cip68v3, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
              {metadata.Cip68v2 ? (
                <AccordionItem
                  key="cip68v2"
                  aria-label="Raw CIP-68v2 Metadata"
                  title="CIP-68 (v2)"
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(metadata.Cip68v2, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
              {metadata.Cip68v1 ? (
                <AccordionItem
                  key="cip68v1"
                  aria-label="Raw CIP-68v1 Metadata"
                  title="CIP-68 (v1)"
                  classNames={{
                    title: "text-xs text-p-secondary",
                    content: "pb-2",
                  }}
                >
                  <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
                    {JSONBIG.stringify(metadata.Cip68v1, null, 2)}
                  </pre>
                </AccordionItem>
              ) : null}
            </Accordion>
          </div>
        </>
      ) : null}
    </>
  );
}
