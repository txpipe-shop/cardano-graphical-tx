import { Hash } from "@laceanatomy/types";

export function resolveBlockReq(
  id: string,
): { hash: Hash } | { height: bigint } | null {
  if (/^[0-9a-fA-F]{64}$/.test(id)) {
    return { hash: Hash(id) };
  }
  if (/^\d+$/.test(id)) {
    return { height: BigInt(id) };
  }
  return null;
}
