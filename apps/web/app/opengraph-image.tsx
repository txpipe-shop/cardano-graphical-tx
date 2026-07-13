import { DEFAULT_DESCRIPTION, SITE_NAME } from "~/app/_utils/metadata";
import {
  ogImageContentType,
  ogImageSize,
  renderOpenGraphImage,
} from "~/app/_utils/og-image";

export const alt = SITE_NAME;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOpenGraphImage({
    kind: "home",
    title: SITE_NAME,
    eyebrow: "Cardano transaction anatomy",
    description: DEFAULT_DESCRIPTION,
    facts: [
      ["Mode", "Graphical"],
      ["Data", "CBOR + hashes"],
      ["Built by", "TxPipe"],
    ],
  });
}
