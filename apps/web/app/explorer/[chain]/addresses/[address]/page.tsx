import { parseAddress } from "@laceanatomy/napi-pallas";
import { type AddressFundsRes } from "@laceanatomy/provider-core";
import {
  Address as AddressValue,
  HexString,
  hexToBech32,
  isBase58,
  isBech32,
  isHexString,
  Unit as UnitValue,
  type Address,
  type Unit,
} from "@laceanatomy/types";
import Link from "next/link";
import { Suspense } from "react";
import {
  ByronSection,
  ShelleySection,
  StakeSection,
} from "~/app/_components/AddressSection";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import DateViewer from "~/app/_components/ExplorerSection/DateViewer";
import TokenPill from "~/app/_components/ExplorerSection/TokenPill";
import { TxTableSkeleton } from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { DEFAULT_DEVNET_PORT, ROUTES } from "~/app/_utils/constants";
import { formatAda } from "~/app/_utils/explorer";
import {
  getNetworkConfig,
  isValidChain,
  NETWORK,
  type Network,
} from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";
import AddressTabs, { type AddressTab } from "./_components/AddressTabs";
import { AddressTxList, getAddressTxPage } from "./_components/AddressTxList";
import {
  AddressUTxOsList,
  getAddressUTxOsPage,
} from "./_components/AddressUTxOsList";

export const revalidate = 10;

interface Props {
  params: { chain: string; address: string };
  searchParams?: { tab?: string; page?: string };
}
const ADDRESS_TABS: AddressTab[] = ["Dissect", "UTxOs", "Transactions"];

function resolveTab(tab?: string): AddressTab {
  if (!tab) return "Dissect";
  const normalized = tab.toLowerCase();
  const match = ADDRESS_TABS.find(
    (candidate) => candidate.toLowerCase() === normalized,
  );
  return match ?? "Dissect";
}

function resolveProvider(chain: Network) {
  if (chain === NETWORK.DEVNET) {
    return getU5CProviderNode(Number.parseInt(DEFAULT_DEVNET_PORT, 10));
  }
  return getDolosProvider(chain);
}

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "response" in error &&
      typeof (error as { response?: { status?: number } }).response?.status ===
        "number" &&
      (error as { response?: { status?: number } }).response?.status === 404,
  );
}

function resolveStakePrefix(chain: Network): string {
  return chain === NETWORK.MAINNET ? "stake" : "stake_test";
}

function resolveDisplayAddress(
  raw: string,
  kind: string | undefined,
  chain: Network,
): string {
  if (isBech32(raw) || isBase58(raw)) return raw;
  if (!isHexString(raw)) return raw;

  const prefix =
    kind === "Stake"
      ? resolveStakePrefix(chain)
      : getNetworkConfig(chain).addressPrefix;
  try {
    return hexToBech32(HexString(raw), prefix);
  } catch {
    return raw;
  }
}

function resolveShelleyTypeLabel(
  addressInfo: NonNullable<ReturnType<typeof parseAddress>["address"]>,
): string {
  const payment = addressInfo.paymentPart;
  const delegation = addressInfo.delegationPart;

  if (delegation?.pointer) return "Pointer address";
  if (delegation?.hash && payment) return "Base address (payment & delegation)";
  if (payment && !delegation?.hash && !delegation?.pointer)
    return "Base address (payment only)";

  return "Shelley";
}

function resolveTypeLabel(
  addressInfo: ReturnType<typeof parseAddress>["address"] | undefined,
  raw: string,
): string {
  if (!addressInfo) {
    if (isBase58(raw)) return "Byron Legacy";
    if (isBech32(raw)) return "Payment (Shelley)";
    return "Unknown";
  }

  const kind = addressInfo.kind;

  if (kind === "Byron") return "Byron Legacy";
  if (kind === "Stake") return "Reward address";

  if (kind === "Shelley") return resolveShelleyTypeLabel(addressInfo);

  return "Unknown";
}

interface AddressStats {
  funds: AddressFundsRes;
  statsError: string | null;
  utxoCount: bigint;
  txCount: bigint;
  firstSeen: { timestamp?: number };
  lastSeen: { timestamp?: number };
}

async function loadAddressStats({
  chain,
  normalizedAddress,
  page,
}: Readonly<{
  chain: Network;
  normalizedAddress: Address;
  page: number;
}>): Promise<AddressStats> {
  const result: AddressStats = {
    funds: {
      value: { [UnitValue("lovelace")]: 0n },
      txCount: 0n,
    },
    statsError: null,
    utxoCount: 0n,
    txCount: 0n,
    firstSeen: {},
    lastSeen: {},
  };

  const [fundsRes, utxosRes, txsRes] = await Promise.allSettled([
    resolveProvider(chain).getAddressFunds({ address: normalizedAddress }),
    getAddressUTxOsPage({
      chain,
      address: normalizedAddress,
      page,
    }),
    getAddressTxPage({
      chain,
      address: normalizedAddress,
      page,
    }),
  ]);

  if (fundsRes.status === "fulfilled") {
    result.funds = fundsRes.value;
  } else if (!isNotFoundError(fundsRes.reason)) {
    console.error(fundsRes.reason);
    result.statsError = "Address stats are unavailable right now.";
  }

  if (utxosRes.status === "fulfilled") {
    result.utxoCount = BigInt(utxosRes.value.data.length);
  } else if (!isNotFoundError(utxosRes.reason)) {
    console.error(utxosRes.reason);
    result.statsError = "Address stats are unavailable right now.";
  }

  if (txsRes.status === "fulfilled") {
    result.txCount = BigInt(txsRes.value.data.length);

    if (txsRes.value.data.length > 0) {
      const newestTx = txsRes.value.data[0];
      if (newestTx) {
        result.funds.lastSeen = {
          blockHeight: newestTx.block.height,
          slot: newestTx.block.slot,
          hash: newestTx.hash,
        };
        result.lastSeen.timestamp = newestTx.createdAt;
      }

      const oldestTx = txsRes.value.data[txsRes.value.data.length - 1];
      if (oldestTx) {
        result.funds.firstSeen = {
          blockHeight: oldestTx.block.height,
          slot: oldestTx.block.slot,
          hash: oldestTx.hash,
        };
        result.firstSeen.timestamp = oldestTx.createdAt;
      }
    }
  } else if (!isNotFoundError(txsRes.reason)) {
    console.error(txsRes.reason);
    result.statsError = "Address stats are unavailable right now.";
  }

  return result;
}

function OverviewStat({
  label,
  value,
}: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-background p-4 shadow-md">
      <div className="text-xs font-medium text-p-secondary">{label}</div>
      <div className="mt-2 text-sm leading-relaxed text-p-primary">{value}</div>
    </div>
  );
}

function UTxOsSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-busy aria-live="polite">
      {Array.from({ length: 3 }, (_, index) => index + 1).map((id) => (
        <div
          key={`utxos-skeleton-${id}`}
          className="rounded-lg border-2 border-dashed border-border bg-surface p-4 shadow-md"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="h-4 w-56 rounded bg-explorer-row" />
            <div className="h-4 w-28 rounded bg-explorer-row" />
            <div className="h-4 w-20 rounded bg-explorer-row" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="h-5 w-24 rounded bg-explorer-row" />
            <div className="h-5 w-20 rounded bg-explorer-row" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AddressDetailPage({
  params,
  searchParams,
}: Readonly<Props>) {
  const chainParam = params.chain || NETWORK.MAINNET;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const raw = params.address;
  const tab = resolveTab(searchParams?.tab);
  const page = Math.max(1, Number(searchParams?.page) || 1);

  let normalizedAddress: Address;
  try {
    normalizedAddress = AddressValue(raw);
  } catch {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
            Invalid Cardano address.
          </div>
        </main>
      </div>
    );
  }

  let addressInfoRes: ReturnType<typeof parseAddress>;
  try {
    addressInfoRes = parseAddress(raw);
  } catch (err) {
    console.error(err);
    addressInfoRes = { error: "Invalid address" };
  }

  if (addressInfoRes.error && addressInfoRes.error.trim() !== "") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
          <div className="rounded-lg border-2 border-dashed border-red-3 bg-red-50 p-8 text-center text-red-2">
            Invalid Cardano address.
          </div>
        </main>
      </div>
    );
  }

  const addressInfo = addressInfoRes.address;
  const typeLabel = resolveTypeLabel(addressInfo, raw);
  const displayAddress = resolveDisplayAddress(raw, addressInfo?.kind, chain);

  const basePath = `/explorer/${chain}/addresses/${encodeURIComponent(raw)}`;

  const { funds, statsError, utxoCount, txCount, firstSeen, lastSeen } =
    await loadAddressStats({ chain, normalizedAddress, page });

  const lovelace = funds.value["lovelace" as Unit] ?? 0n;
  const tokenEntries = Object.entries(funds.value).filter(
    ([unit]) => unit !== "lovelace",
  );

  const hasAnyActivity =
    funds.txCount > 0n ||
    lovelace > 0n ||
    tokenEntries.length > 0 ||
    !!funds.firstSeen ||
    !!funds.lastSeen;

  const dissectContent = (
    <>
      {addressInfo?.kind === "Shelley" && <ShelleySection data={addressInfo} />}
      {addressInfo?.kind === "Stake" && <StakeSection data={addressInfo} />}
      {addressInfo?.kind === "Byron" && <ByronSection data={addressInfo} />}
    </>
  );

  const utxosContent =
    tab === "UTxOs" ? (
      <Suspense fallback={<UTxOsSkeleton />}>
        <AddressUTxOsList
          address={normalizedAddress}
          chain={chain}
          page={page}
          basePath={basePath}
        />
      </Suspense>
    ) : null;

  const txsContent =
    tab === "Transactions" ? (
      <Suspense fallback={<TxTableSkeleton rows={3} />}>
        <AddressTxList
          address={normalizedAddress}
          chain={chain}
          page={page}
          basePath={basePath}
        />
      </Suspense>
    ) : null;

  const tabs = [
    {
      key: "Dissect",
      title: "Dissect",
      content: dissectContent,
    },
    {
      key: "UTxOs",
      title: `UTxOs (${utxoCount.toString()})`,
      content: utxosContent,
    },
    {
      key: "Transactions",
      title: `Transactions (${txCount.toString()})`,
      content: txsContent,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6">
        <div className="mb-4 flex flex-shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="break-all text-lg font-extrabold text-p-primary md:text-3xl">
              {displayAddress}
              <CopyButton text={displayAddress} size={16} />
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-explorer-row px-2 py-0.5 text-xs font-medium text-p-secondary">
                {typeLabel}
              </span>
            </div>
          </div>
        </div>

        {statsError && (
          <div className="mb-4 rounded-lg border-2 border-dashed border-border bg-surface p-4 text-center text-p-secondary shadow-md">
            {statsError}
          </div>
        )}

        {!hasAnyActivity && (
          <div className="mb-4 rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
            No activity for this address.
          </div>
        )}

        <div className="rounded-lg border-2 border-dashed border-border bg-surface shadow-md">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <OverviewStat
                label="Total Value"
                value={
                  <div className="space-y-2">
                    <div className="font-mono">ADA: {formatAda(lovelace)}</div>
                    {tokenEntries.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tokenEntries.slice(0, 3).map(([unit, amount]) => (
                          <TokenPill
                            key={unit}
                            unit={unit as Unit}
                            amount={amount}
                          />
                        ))}
                        {tokenEntries.length > 3 && (
                          <span className="rounded-full border border-border bg-explorer-row px-3 py-1 text-xs text-p-secondary">
                            +{tokenEntries.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                }
              />

              <OverviewStat
                label="Transaction Count"
                value={txCount.toString()}
              />

              <OverviewStat
                label="First Seen"
                value={
                  funds.firstSeen ? (
                    <div className="space-y-2">
                      <div className="font-mono text-xs">
                        Block{" "}
                        <Link
                          href={ROUTES.EXPLORER_BLOCK(
                            chain,
                            funds.firstSeen.blockHeight.toString(),
                          )}
                          className="hover:underline"
                        >
                          {funds.firstSeen.blockHeight.toString()}
                        </Link>
                      </div>
                      <div className="font-mono text-xs">
                        Slot {funds.firstSeen.slot.toString()}
                      </div>
                      {firstSeen.timestamp !== undefined && (
                        <DateViewer
                          timestamp={firstSeen.timestamp}
                          className="text-xs text-p-secondary"
                        />
                      )}
                    </div>
                  ) : (
                    <span className="text-p-secondary">—</span>
                  )
                }
              />

              <OverviewStat
                label="Last Seen"
                value={
                  funds.lastSeen ? (
                    <div className="space-y-2">
                      <div className="font-mono text-xs">
                        Block{" "}
                        <Link
                          href={ROUTES.EXPLORER_BLOCK(
                            chain,
                            funds.lastSeen.blockHeight.toString(),
                          )}
                          className="hover:underline"
                        >
                          {funds.lastSeen.blockHeight.toString()}
                        </Link>
                      </div>
                      <div className="font-mono text-xs">
                        Slot {funds.lastSeen.slot.toString()}
                      </div>
                      {lastSeen.timestamp !== undefined && (
                        <DateViewer
                          timestamp={lastSeen.timestamp}
                          className="text-xs text-p-secondary"
                        />
                      )}
                    </div>
                  ) : (
                    <span className="text-p-secondary">—</span>
                  )
                }
              />
            </div>
          </div>

          <div className="border-t border-border p-4">
            <AddressTabs tabs={tabs} activeTab={tab} basePath={basePath} />
          </div>
        </div>
      </main>
    </div>
  );
}
