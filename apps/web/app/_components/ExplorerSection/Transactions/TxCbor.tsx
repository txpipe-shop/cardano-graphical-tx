"use client";

import CborView from "../../CborView";

export default function TxCbor({ cbor }: { cbor: string }) {
  return <CborView cbor={cbor} />;
}
