import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from "~/app/_utils/og-image";

export const alt = "Transaction Tools";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOpenGraphImage({
    kind: "tx",
    title: "Transaction Tools",
    eyebrow: "CBOR + hash workflow",
    description:
      "Draw, dissect, and inspect Cardano transactions from CBOR or transaction hashes.",
    facts: [
      ["Input", "CBOR or hash"],
      ["Views", "Diagram + dissect"],
      ["Network", "Mainnet + testnets"],
    ],
  });
}
