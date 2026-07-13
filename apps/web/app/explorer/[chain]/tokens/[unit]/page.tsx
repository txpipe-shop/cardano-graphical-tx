import type { Unit } from "@laceanatomy/types";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DevnetError } from "~/app/_components/DevnetError";
import { EmptyState } from "~/app/_components/EmptyState";
import TokenTabs from "~/app/_components/ExplorerSection/Tokens/TokenTabs";
import { ROUTES, TOKEN_TABS, type TokenTab } from "~/app/_utils";
import {
  createPageMetadata,
  formatChain,
  truncateMiddle,
} from "~/app/_utils/metadata";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { isExplorerNotFound } from "../../../_utils/not-found";
import { AssetHistoryList } from "./_components/AssetHistoryList";
import { TokenPageLayout } from "./_components/TokenPageLayout";
import { type AssetInfo, loadTokenPageData } from "./_shared";
import DevnetTokenTabs from "./DevnetTokenTabs";

interface Props {
  params: Promise<{ chain: Network; unit: Unit }>;
  searchParams?: Promise<{ tab?: string; page?: string }>;
}

function getCip68Field(
  cip68: Record<string, unknown> | null | undefined,
  field: string,
): unknown {
  if (!cip68 || !(field in cip68)) return undefined;
  return cip68[field];
}

function resolveTokenName(assetInfo: AssetInfo): string {
  const { metadata } = assetInfo;
  const cip26 = metadata.Cip26;
  const cip25 = metadata.Cip25v1 ?? metadata.Cip25v2;
  const cip68 =
    metadata.Cip68v4 ??
    metadata.Cip68v3 ??
    metadata.Cip68v2 ??
    metadata.Cip68v1;
  const cip68Obj = typeof cip68 === "object" ? cip68 : null;
  const decodedName = assetInfo.assetNameHex
    ? Buffer.from(assetInfo.assetNameHex, "hex").toString("utf8")
    : null;

  return (
    cip26?.name ??
    cip25?.name ??
    (getCip68Field(cip68Obj, "name") as string | undefined) ??
    decodedName ??
    assetInfo.fingerprint ??
    truncateMiddle(assetInfo.unit)
  );
}

function formatSupply(totalSupply: string): string {
  try {
    return BigInt(totalSupply).toLocaleString("en-US");
  } catch {
    return totalSupply;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unit, chain: chainParam } = await params;
  const chain = isValidChain(chainParam) ? chainParam : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const rawUnit = unit.startsWith("0x") ? unit.slice(2) : unit;
  const shortUnit = truncateMiddle(rawUnit);
  const fallbackTitle = `Token ${shortUnit} on ${chainLabel}`;
  const fallbackDescription = `Inspect Cardano ${chainLabel} token ${shortUnit} in Lace Anatomy.`;
  const path = ROUTES.EXPLORER_TOKEN(chain, unit);

  if (chain === NETWORK.DEVNET) {
    return createPageMetadata({
      title: fallbackTitle,
      description: fallbackDescription,
      path,
    });
  }

  const { data, error } = await loadData(chain, unit);

  if (!data) {
    if (isExplorerNotFound(error)) notFound();

    return createPageMetadata({
      title: fallbackTitle,
      description: fallbackDescription,
      path,
    });
  }

  const displayName = resolveTokenName(data.assetInfo);
  const holders =
    data.addressesTotal === null
      ? `${data.addresses.length}+`
      : data.addressesTotal.toString();
  const title = `${displayName} on ${chainLabel}`;
  const description = `${formatSupply(data.assetInfo.totalSupply)} supply, ${holders} holder preview, ${data.assetInfo.mintOrBurnCount} mint/burn events.`;

  return createPageMetadata({
    title,
    description,
    path,
  });
}

function resolveTab(tab?: string): TokenTab {
  if (!tab) return "Holders";
  const normalized = tab.toLowerCase();
  const match = TOKEN_TABS.find(
    (candidate) => candidate.toLowerCase() === normalized,
  );
  return match ?? "Holders";
}

async function loadData(chain: Network, unit: Unit, page: number = 1) {
  try {
    const provider = getDolosProvider(chain);
    const data = await loadTokenPageData(provider, unit, chain, page);
    return { data, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: err };
  }
}

export default async function TokenPage({ params, searchParams }: Props) {
  const { unit, chain: chainParam } = await params;
  const searchParamsAwaited = searchParams ? await searchParams : undefined;
  const chain = isValidChain(chainParam) ? chainParam : NETWORK.MAINNET;
  const tabParam = searchParamsAwaited?.tab;
  const tab = resolveTab(tabParam);
  const page = Math.max(
    1,
    Number.parseInt(searchParamsAwaited?.page || "1", 10) || 1,
  );

  if (chain === NETWORK.DEVNET) {
    return (
      <TokenPageLayout>
        <DevnetTokenTabs unit={unit} tab={tab} />
      </TokenPageLayout>
    );
  }

  const { data, error } = await loadData(chain, unit, page);

  if (error || !data) {
    if (isExplorerNotFound(error)) notFound();

    return (
      <TokenPageLayout>
        <DevnetError title="Token not found or could not be loaded." />
      </TokenPageLayout>
    );
  }

  const historyContent = (
    <Suspense fallback={<EmptyState message="Loading history..." />}>
      <AssetHistoryList chain={chain} unit={data.assetInfo.unit} />
    </Suspense>
  );

  return (
    <TokenPageLayout>
      <TokenTabs
        data={data}
        tab={tab}
        chain={chain}
        historyContent={historyContent}
      />
    </TokenPageLayout>
  );
}
