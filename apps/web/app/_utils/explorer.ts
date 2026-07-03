import {
  type Address,
  cardano,
  HexString,
  hexToBech32,
} from "@laceanatomy/types";
import { DEFAULT_DEVNET_PORT } from "./constants";

export function normalizeAddress(address: Address | undefined): string {
  if (!address) return "No address found";
  const prefix = cardano.addressToBech32Prefix(address);
  return prefix ? hexToBech32(HexString(address), prefix) : address;
}

export function resolveDevnetPort(port: string | undefined) {
  const fallback = Number.parseInt(DEFAULT_DEVNET_PORT, 10);
  if (!port) return fallback;
  const value = Number.parseInt(port, 10);
  if (Number.isNaN(value) || value <= 0 || value > 65535) return fallback;
  return value;
}

export function formatAda(lovelace: bigint | number): string {
  return `${(Number(lovelace) / 1_000_000).toFixed(6)} ₳`;
}
