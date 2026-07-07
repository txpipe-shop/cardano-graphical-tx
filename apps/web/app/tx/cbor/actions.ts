"use server";

import { Hash } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { getDolosProvider } from "~/server/api/dolos-provider";

export async function fetchCborByHash(
  hash: string,
  network: Network,
): Promise<{ cbor: string }> {
  const provider = getDolosProvider(network);
  const cbor = await provider.getCBOR({ hash: Hash(hash) });
  return { cbor };
}
