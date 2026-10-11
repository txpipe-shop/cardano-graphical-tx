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
import { getNetworkConfig, type Network } from "@laceanatomy/types/cardano";
import { cache } from "react";
import { ADDRESS_PAGE_SIZE } from "~/app/_utils/constants";
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

export interface SeenAt {
  blockHeight: bigint;
  slot: bigint;
  hash: string;
  timestamp?: number;
}

/** What the address holds now, from its first page of UTxOs. */
export interface AddressHoldings {
  balance: bigint;
  tokenEntries: [string, bigint][];
  error: string | null;
}

/** What the address has done, from its newest page of transactions. */
export interface AddressActivity {
  txCount: bigint;
  /** The address has more transactions than one page; `txCount` is then a lower bound. */
  hasMoreTxs: boolean;
  firstSeen?: SeenAt;
  lastSeen?: SeenAt;
  error: string | null;
}

export type AddressStats = AddressHoldings & AddressActivity;

const STATS_UNAVAILABLE = "Address stats are unavailable right now.";

export const loadAddressHoldings = cache(async function loadAddressHoldings(
  chain: Network,
  normalizedAddress: Address,
): Promise<AddressHoldings> {
  try {
    const { data } = await getAddressUTxOsPage(chain, normalizedAddress);
    let balance = 0n;
    const tokenMap = new Map<string, bigint>();
    for (const utxo of data) {
      balance += utxo.coin ?? 0n;
      for (const [unit, amount] of Object.entries(utxo.value)) {
        if (unit === "lovelace") continue;
        tokenMap.set(unit, (tokenMap.get(unit) ?? 0n) + amount);
      }
    }
    return { balance, tokenEntries: [...tokenMap.entries()], error: null };
  } catch (err) {
    if (!isNotFoundError(err)) console.error(err);
    return {
      balance: 0n,
      tokenEntries: [],
      error: isNotFoundError(err) ? null : STATS_UNAVAILABLE,
    };
  }
});

function seenAt(tx: cardano.Tx): SeenAt {
  return {
    blockHeight: tx.block.height,
    slot: tx.block.slot,
    hash: tx.hash,
    timestamp: tx.createdAt,
  };
}

export const loadAddressActivity = cache(async function loadAddressActivity(
  chain: Network,
  normalizedAddress: Address,
): Promise<AddressActivity> {
  try {
    const { data, total } = await getAddressTxPage(chain, normalizedAddress);
    const hasMoreTxs = total > ADDRESS_PAGE_SIZE;
    const newest = data[0];
    const oldest = data[data.length - 1];
    return {
      txCount: total,
      hasMoreTxs,
      lastSeen: newest && seenAt(newest),
      // The page holds the newest transactions, so its oldest is only the
      // first one when nothing older exists.
      firstSeen: oldest && !hasMoreTxs ? seenAt(oldest) : undefined,
      error: null,
    };
  } catch (err) {
    if (!isNotFoundError(err)) console.error(err);
    return {
      txCount: 0n,
      hasMoreTxs: false,
      error: isNotFoundError(err) ? null : STATS_UNAVAILABLE,
    };
  }
});

export const loadAddressStats = cache(async function loadAddressStats(
  chain: Network,
  normalizedAddress: Address,
): Promise<AddressStats> {
  const [holdings, activity] = await Promise.all([
    loadAddressHoldings(chain, normalizedAddress),
    loadAddressActivity(chain, normalizedAddress),
  ]);
  return {
    ...holdings,
    ...activity,
    error: holdings.error ?? activity.error,
  };
});

/**
 * False only when the address is known to have never been used. Its
 * transactions are read only when it holds nothing, since that read scans
 * the address's history on Dolos.
 */
export async function isAddressUsed(
  chain: Network,
  normalizedAddress: Address,
  holdings: AddressHoldings,
): Promise<boolean> {
  if (
    holdings.error ||
    holdings.balance > 0n ||
    holdings.tokenEntries.length > 0
  ) {
    return true;
  }
  const activity = await loadAddressActivity(chain, normalizedAddress);
  return activity.error !== null || activity.txCount > 0n;
}

export function formatTxCount({
  txCount,
  hasMoreTxs,
}: Pick<AddressActivity, "txCount" | "hasMoreTxs">): string {
  return hasMoreTxs ? `${ADDRESS_PAGE_SIZE}+` : txCount.toString();
}
