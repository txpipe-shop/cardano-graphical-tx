"use client";

import CborView from "../../CborView";

export default function BlockCbor({ cbor }: { cbor: string | null }) {
  return (
    <CborView cbor={cbor} emptyMessage="CBOR not available for this block." />
  );
}
