import type { parseAddress } from "@laceanatomy/napi-pallas";
import type { Address } from "@laceanatomy/types";
import {
  cardano,
  HexString,
  hexToBech32,
  isBase58,
  isBech32,
  isHexString,
} from "@laceanatomy/types";
import { getNetworkConfig, type Network } from "~/app/_utils/network-config";
import { getAddressTxPage } from "./_components/AddressTxList";
import { getAddressUTxOsPage } from "./_components/AddressUTxOsList";

const ADDRESS_TABS = ["Dissect", "UTxOs", "Transactions"] as const;

export function resolveTab(tab?: string) {
  if (!tab) return "Dissect";
  const normalized = tab.toLowerCase();
  const match = ADDRESS_TABS.find(
    (candidate) => candidate.toLowerCase() === normalized,
  );
  return match ?? "Dissect";
}

export function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { status?: number } }).response?.status ===
      "number" &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

export function resolveDisplayAddress(
  raw: string,
  kind: string | undefined,
  chain: Network,
  normalized?: Address,
): string {
  if (isBech32(raw) || isBase58(raw)) return raw;
  if (!isHexString(raw)) return raw;

  const fallbackPrefix = getNetworkConfig(chain).addressPrefix;

  let prefix: string | null = null;
  if (kind === "Stake") {
    prefix =
      cardano.addressToBech32Prefix((normalized ?? raw) as Address) ?? null;
  }

  try {
    return hexToBech32(HexString(raw), prefix ?? fallbackPrefix);
  } catch {
    return raw;
  }
}

export function resolveTypeLabel(
  addressInfo: ReturnType<typeof parseAddress>["address"] | undefined,
  raw: string,
): string {
  if (!addressInfo) {
    if (isBase58(raw)) return "Byron Legacy";
    if (isBech32(raw)) return "Payment (Shelley)";
    return "Unknown";
  }

  const { kind } = addressInfo;

  if (kind === "Byron") return "Byron Legacy";
  if (kind === "Stake") return "Reward address";
  if (kind !== "Shelley") return "Unknown";

  const { paymentPart: payment, delegationPart: delegation } = addressInfo;
  if (delegation?.pointer) return "Pointer address";
  if (delegation?.hash && payment) return "Base address (payment & delegation)";
  if (payment && !delegation?.hash && !delegation?.pointer)
    return "Base address (payment only)";

  return "Shelley";
}

export interface AddressStats {
  balance: bigint;
  tokenEntries: [string, bigint][];
  txCount: bigint;
  firstSeen?: {
    blockHeight: bigint;
    slot: bigint;
    hash: string;
    timestamp?: number;
  };
  lastSeen?: {
    blockHeight: bigint;
    slot: bigint;
    hash: string;
    timestamp?: number;
  };
  error: string | null;
}

export async function loadAddressStats({
  chain,
  normalizedAddress,
}: Readonly<{
  chain: Network;
  normalizedAddress: Address;
}>): Promise<AddressStats> {
  let balance = 0n;
  let tokenEntries: [string, bigint][] = [];
  let txCount = 0n;
  let firstSeen: AddressStats["firstSeen"];
  let lastSeen: AddressStats["lastSeen"];
  let error: string | null = null;

  const [utxosRes, txsRes] = await Promise.allSettled([
    getAddressUTxOsPage({ chain, address: normalizedAddress }),
    getAddressTxPage({ chain, address: normalizedAddress }),
  ]);

  if (utxosRes.status === "fulfilled") {
    const tokenMap = new Map<string, bigint>();
    for (const utxo of utxosRes.value.data) {
      balance += utxo.coin ?? 0n;
      for (const [unit, amount] of Object.entries(utxo.value)) {
        if (unit === "lovelace") continue;
        tokenMap.set(unit, (tokenMap.get(unit) ?? 0n) + amount);
      }
    }
    tokenEntries = [...tokenMap.entries()];
  } else if (!isNotFoundError(utxosRes.reason)) {
    console.error(utxosRes.reason);
    error = "Address stats are unavailable right now.";
  }

  if (txsRes.status === "fulfilled") {
    txCount = txsRes.value.total;
    const { data } = txsRes.value;

    if (data.length > 0) {
      const newest = data[0]!;
      lastSeen = {
        blockHeight: newest.block.height,
        slot: newest.block.slot,
        hash: newest.hash,
        timestamp: newest.createdAt,
      };

      const oldest = data[data.length - 1]!;
      firstSeen = {
        blockHeight: oldest.block.height,
        slot: oldest.block.slot,
        hash: oldest.hash,
        timestamp: oldest.createdAt,
      };
    }
  } else if (!isNotFoundError(txsRes.reason)) {
    console.error(txsRes.reason);
    error = "Address stats are unavailable right now.";
  }

  return { balance, tokenEntries, txCount, firstSeen, lastSeen, error };
}
