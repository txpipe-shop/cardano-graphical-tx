import type { Metadata } from "next";

export const SITE_URL = "https://laceanatomy.com";
export const SITE_NAME = "Lace Anatomy";
export const DEFAULT_TITLE = SITE_NAME;
export const DEFAULT_DESCRIPTION =
  "Visualize and dissect Cardano transactions, addresses, blocks, and tokens with developer-focused blockchain diagrams.";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function truncateMiddle(value: string, start = 12, end = 10): string {
  if (value.length <= start + end + 1) return value;
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}

export function formatChain(chain: string): string {
  return chain.charAt(0).toUpperCase() + chain.slice(1);
}

export function formatAdaCompact(
  lovelace: bigint | number | undefined,
): string {
  if (lovelace === undefined) return "Unknown";
  const ada = Number(lovelace) / 1_000_000;
  return `${ada.toLocaleString("en-US", {
    maximumFractionDigits: ada >= 1 ? 2 : 6,
  })} ₳`;
}

export function formatInteger(value: bigint | number | undefined): string {
  if (value === undefined) return "Unknown";
  return Number(value).toLocaleString("en-US");
}

export function createPageMetadata({
  title,
  description,
  path,
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
