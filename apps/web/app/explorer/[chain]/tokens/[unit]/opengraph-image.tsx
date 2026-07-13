import type { Unit } from "@laceanatomy/types";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import { formatChain, truncateMiddle } from "~/app/_utils/metadata";
import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from "~/app/_utils/og-image";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { type AssetInfo, loadTokenPageData } from "./_shared";

export const alt = "Token";
export const size = ogImageSize;
export const contentType = ogImageContentType;

type Props = {
  params: Promise<{ chain: Network; unit: Unit }>;
};

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

async function loadData(chain: Network, unit: Unit, page: number = 1) {
  try {
    const provider = getDolosProvider(chain);
    const data = await loadTokenPageData(provider, unit, chain, page);
    return { data, error: null };
  } catch (err) {
    console.error(err);
    return { data: null, error: true };
  }
}

export default async function Image({ params }: Props) {
  const { unit, chain: chainParam } = await params;
  const chain = isValidChain(chainParam) ? chainParam : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const rawUnit = unit.startsWith("0x") ? unit.slice(2) : unit;
  const shortUnit = truncateMiddle(rawUnit);
  const fallbackDescription = `Inspect Cardano ${chainLabel} token ${shortUnit} in Lace Anatomy.`;

  if (chain === NETWORK.DEVNET) {
    return renderOpenGraphImage({
      kind: "token",
      title: rawUnit,
      eyebrow: "Token",
      description: fallbackDescription,
      chain,
      facts: [
        ["Unit", shortUnit],
        ["Network", chainLabel],
      ],
    });
  }

  const { data } = await loadData(chain, unit);

  if (!data) {
    return renderOpenGraphImage({
      kind: "token",
      title: rawUnit,
      eyebrow: "Token",
      description: fallbackDescription,
      chain,
      facts: [
        ["Unit", shortUnit],
        ["Network", chainLabel],
      ],
    });
  }

  const displayName = resolveTokenName(data.assetInfo);
  const holders =
    data.addressesTotal === null
      ? `${data.addresses.length}+`
      : data.addressesTotal.toString();
  const description = `${formatSupply(data.assetInfo.totalSupply)} supply, ${holders} holder preview, ${data.assetInfo.mintOrBurnCount} mint/burn events.`;

  return renderOpenGraphImage({
    kind: "token",
    title: displayName,
    eyebrow: data.assetInfo.fingerprint || "Token",
    description,
    chain,
    facts: [
      ["Policy", truncateMiddle(data.assetInfo.policyId)],
      ["Supply", formatSupply(data.assetInfo.totalSupply)],
      ["Holders", holders],
      ["Events", data.assetInfo.mintOrBurnCount.toString()],
      ["Metadata", data.assetInfo.metadataSources.join(", ") || "None"],
    ],
  });
}
