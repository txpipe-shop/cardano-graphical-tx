import type { Metadata } from "next";
import { ROUTES } from "~/app/_utils/constants";
import { createPageMetadata } from "~/app/_utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Transaction Dissector",
  description:
    "Break Cardano transactions into inputs, outputs, witnesses, metadata, scripts, and ledger details.",
  path: ROUTES.DISSECT,
});

export default function DissectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
