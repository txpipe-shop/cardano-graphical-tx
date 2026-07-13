import { Hash } from "@laceanatomy/types";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import {
  formatAdaCompact,
  formatChain,
  formatInteger,
  truncateMiddle,
} from "~/app/_utils/metadata";
import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from "~/app/_utils/og-image";
import { getDolosProvider } from "~/server/api/dolos-provider";

export const alt = "Transaction";
export const size = ogImageSize;
export const contentType = ogImageContentType;

type Props = {
  params: Promise<{ chain: Network; hash: string }>;
};

export default async function Image({ params }: Props) {
  const { hash, chain: chainParam } = await params;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const shortHash = truncateMiddle(hash);
  const fallbackDescription = `Inspect Cardano ${chainLabel} transaction ${shortHash} in Lace Anatomy.`;

  if (chain === NETWORK.DEVNET) {
    return renderOpenGraphImage({
      kind: "transaction",
      title: hash,
      eyebrow: "Transaction",
      description: fallbackDescription,
      chain,
      facts: [
        ["Hash", shortHash],
        ["Network", chainLabel],
      ],
    });
  }

  try {
    const tx = await getDolosProvider(chain).getTx({ hash: Hash(hash) });
    const mintCount = Object.keys(tx.mint ?? {}).length;
    const scriptCount = tx.witnesses?.scripts?.length ?? 0;
    const datumCount = tx.outputs.filter((output) => output.datum).length;
    const description = `Block ${tx.block.height.toString()} transaction with ${tx.inputs.length} inputs, ${tx.outputs.length} outputs, and ${formatAdaCompact(tx.fee)} fee.`;

    return renderOpenGraphImage({
      kind: "transaction",
      title: hash,
      eyebrow: "Transaction",
      description,
      chain,
      facts: [
        ["Block", tx.block.height.toString()],
        ["Fee", formatAdaCompact(tx.fee)],
        ["Inputs", tx.inputs.length.toString()],
        ["Outputs", tx.outputs.length.toString()],
        ["Mint", formatInteger(mintCount)],
        [
          "Scripts",
          scriptCount || datumCount
            ? `${scriptCount}/${datumCount} datum`
            : "None",
        ],
      ],
    });
  } catch (err) {
    console.error(err);
    return renderOpenGraphImage({
      kind: "transaction",
      title: hash,
      eyebrow: "Transaction",
      description: fallbackDescription,
      chain,
      facts: [
        ["Hash", shortHash],
        ["Network", chainLabel],
      ],
    });
  }
}
