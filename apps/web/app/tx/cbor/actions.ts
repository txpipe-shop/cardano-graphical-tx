"use server";

import { Hash } from "@laceanatomy/types";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { type Network } from "~/app/_utils/network-config";

export async function fetchCborByHash(
  hash: string,
  network: Network,
): Promise<{ cbor: string }> {
  const provider = getDolosProvider(network);
  const cbor = await provider.getCBOR({ hash: Hash(hash) });
  return { cbor };
}
