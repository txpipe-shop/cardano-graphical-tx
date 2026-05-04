"use client";

import CborView from "../../shared/CborView";

export default function TxCbor({ cbor }: { cbor: string }) {
  return <CborView cbor={cbor} />;
}
