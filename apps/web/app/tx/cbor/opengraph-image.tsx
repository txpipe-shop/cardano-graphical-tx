import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from "~/app/_utils/og-image";

export const alt = "CBOR Transaction Inspector";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOpenGraphImage({
    kind: "tx",
    title: "CBOR Transaction Inspector",
    eyebrow: "Transaction dissect",
    description:
      "Paste Cardano transaction CBOR, parse it, validate it, and inspect the decoded structure.",
    facts: [
      ["Input", "CBOR"],
      ["Output", "Decoded tx"],
      ["Mode", "Validate + dissect"],
    ],
  });
}
