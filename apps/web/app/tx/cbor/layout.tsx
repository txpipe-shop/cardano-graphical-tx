import type { Metadata } from "next";
import { ROUTES } from "~/app/_utils/constants";
import { createPageMetadata } from "~/app/_utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "CBOR Transaction Inspector",
  description:
    "Paste Cardano transaction CBOR, parse it, validate it, and inspect the decoded structure.",
  path: ROUTES.CBOR,
});

export default function CborLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
