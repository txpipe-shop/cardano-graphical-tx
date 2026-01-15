import {
  type Address,
  HexString,
  hexToBech32,
  isBase58,
} from "@laceanatomy/types";

export function normalizeAddress(
  address: Address | undefined,
  prefix: string,
): string {
  if (!address) return "No address found";
  return isBase58(address) ? address : hexToBech32(HexString(address), prefix);
}

export function formatSeconds(s?: number): string {
  if (!s) return "-";
  try {
    return new Date(s * 1000).toLocaleString();
  } catch {
    return "-";
  }
}
