import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import { formatChain } from "~/app/_utils/metadata";
import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from "~/app/_utils/og-image";

export const alt = "Transaction Explorer";
export const size = ogImageSize;
export const contentType = ogImageContentType;

type Props = {
  params: Promise<{ chain: Network }>;
};

export default async function Image({ params }: Props) {
  const { chain: chainParam } = await params;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const title = `${chainLabel} Transaction Explorer`;
  const description = `Explore recent Cardano ${chainLabel} blocks and transactions in Lace Anatomy.`;

  return renderOpenGraphImage({
    kind: "explorer",
    title,
    eyebrow: "Explorer",
    description,
    chain,
    facts: [
      ["Network", chainLabel],
      ["View", "Blocks + txs"],
    ],
  });
}
