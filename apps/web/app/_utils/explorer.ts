import {
  type Address,
  HexString,
  hexToBech32,
  isBase58,
} from "@laceanatomy/types";
import { DEFAULT_DEVNET_PORT } from "./constants";

export function normalizeAddress(
  address: Address | undefined,
  prefix: string,
): string {
  if (!address) return "No address found";
  return isBase58(address) ? address : hexToBech32(HexString(address), prefix);
}

export function formatSeconds(s?: number): string {
  if (!s) return "-";
  return new Date(s * 1000).toLocaleString();
}

export function resolveDevnetPort(port: string | undefined) {
  const fallback = Number.parseInt(DEFAULT_DEVNET_PORT, 10);
  if (!port) return fallback;
  const value = Number.parseInt(port, 10);
  if (Number.isNaN(value) || value <= 0 || value > 65535) return fallback;
  return value;
}