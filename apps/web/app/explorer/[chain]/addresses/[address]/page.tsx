import { parseAddress } from "@laceanatomy/napi-pallas";
import type { Unit } from "@laceanatomy/types";
import { Address } from "@laceanatomy/types";
import {
  isValidChain,
  NETWORK,
  type Network,
} from "@laceanatomy/types/cardano";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ByronSection,
  ShelleySection,
  StakeSection,
} from "~/app/_components/AddressSection";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import TokenPill from "~/app/_components/ExplorerSection/TokenPill";
import { TxTableSkeleton } from "~/app/_components/ExplorerSection/Transactions";
import { Header } from "~/app/_components/Header";
import { ROUTES } from "~/app/_utils/constants";
import { formatAda } from "~/app/_utils/explorer";
import {
  createPageMetadata,
  formatAdaCompact,
  formatChain,
  truncateMiddle,
} from "~/app/_utils/metadata";
import {
  AddressActivityStats,
  AddressActivityStatsSkeleton,
} from "./_components/AddressActivityStats";
import AddressTabs from "./_components/AddressTabs";
import { AddressTxList } from "./_components/AddressTxList";
import { AddressUTxOsList } from "./_components/AddressUTxOsList";
import { AddressUTxOsSkeleton } from "./_components/AddressUTxOsSkeleton";
import { OverviewStat } from "./_components/OverviewStat";
import {
  isAddressUsed,
  loadAddressHoldings,
  resolveDisplayAddress,
  resolveTab,
  resolveTypeLabel,
} from "./_utils";

export const revalidate = 10;

interface Props {
  params: Promise<{ chain: Network; address: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chain: chainParam, address: raw } = await params;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const chainLabel = formatChain(chain);
  const shortAddress = truncateMiddle(raw, 16, 12);
  const fallbackTitle = `Address ${shortAddress} on ${chainLabel}`;
  const fallbackDescription = `Inspect Cardano ${chainLabel} address ${shortAddress} in Lace Anatomy.`;
  const path = ROUTES.EXPLORER_ADDRESS(chain, raw);

  let normalizedAddress: Address;
  try {
    normalizedAddress = Address(raw);
  } catch {
    notFound();
  }

  let addressInfoRes: ReturnType<typeof parseAddress>;
  try {
    addressInfoRes = parseAddress(raw);
  } catch {
    notFound();
  }

  if (addressInfoRes.error?.trim()) notFound();

  try {
    const addressInfo = addressInfoRes.address;
    const typeLabel = resolveTypeLabel(addressInfo, raw);
    const displayAddress = resolveDisplayAddress(
      raw,
      addressInfo?.kind,
      chain,
      normalizedAddress,
    );
    const holdings = await loadAddressHoldings(chain, normalizedAddress);
    const { balance, tokenEntries } = holdings;

    if (!(await isAddressUsed(chain, normalizedAddress, holdings))) notFound();

    const title = `${typeLabel} ${truncateMiddle(displayAddress, 16, 12)}`;
    const description = `${formatAdaCompact(balance)} balance, ${tokenEntries.length} native assets on ${chainLabel}.`;

    return createPageMetadata({
      title,
      description,
      path,
    });
  } catch (err) {
    console.error(err);
    return createPageMetadata({
      title: fallbackTitle,
      description: fallbackDescription,
      path,
    });
  }
}

export default async function AddressDetailPage({
  params,
  searchParams,
}: Readonly<Props>) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const chainParam = resolvedParams.chain || NETWORK.MAINNET;
  const chain: Network = isValidChain(chainParam)
    ? chainParam
    : NETWORK.MAINNET;
  const raw = resolvedParams.address;
  const tab = resolveTab(resolvedSearchParams?.tab);

  let normalizedAddress: Address;
  try {
    normalizedAddress = Address(raw);
  } catch {
    notFound();
  }

  let addressInfoRes: ReturnType<typeof parseAddress>;
  try {
    addressInfoRes = parseAddress(raw);
  } catch (err) {
    console.error(err);
    addressInfoRes = { error: "Invalid address" };
  }

  if (addressInfoRes.error?.trim()) {
    notFound();
  }

  const addressInfo = addressInfoRes.address;
  const typeLabel = resolveTypeLabel(addressInfo, raw);
  const displayAddress = resolveDisplayAddress(
    raw,
    addressInfo?.kind,
    chain,
    normalizedAddress,
  );

  const basePath = ROUTES.EXPLORER_ADDRESS(chain, raw);

  // The transaction-derived stats stream in: reading an address's
  // transactions scans its history on Dolos, while its UTxOs are quick.
  const holdings = await loadAddressHoldings(chain, normalizedAddress);
  const { balance, tokenEntries, error } = holdings;

  if (!(await isAddressUsed(chain, normalizedAddress, holdings))) notFound();

  const dissectContent = (
    <div className="px-4 py-2">
      {addressInfo?.kind === "Shelley" && <ShelleySection data={addressInfo} />}
      {addressInfo?.kind === "Stake" && <StakeSection data={addressInfo} />}
      {addressInfo?.kind === "Byron" && <ByronSection data={addressInfo} />}
    </div>
  );

  const tabs = [
    { key: "Dissect", title: "Dissect", content: dissectContent },
    {
      key: "UTxOs",
      title: "UTxOs",
      content: (
        <Suspense fallback={<AddressUTxOsSkeleton />}>
          <AddressUTxOsList address={normalizedAddress} chain={chain} />
        </Suspense>
      ),
    },
    {
      key: "Transactions",
      title: "Transactions",
      content: (
        <Suspense fallback={<TxTableSkeleton rows={3} />}>
          <AddressTxList address={normalizedAddress} chain={chain} />
        </Suspense>
      ),
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

        {error && (
          <div className="mb-4 rounded-lg border-2 border-dashed border-border bg-surface p-4 text-center text-p-secondary shadow-md">
            {error}
          </div>
        )}

        <div className="rounded-lg border-2 border-dashed border-border bg-surface shadow-md">
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <OverviewStat label="Total Value">
                <div className="space-y-2">
                  <div className="font-mono">ADA: {formatAda(balance)}</div>
                  {tokenEntries.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tokenEntries.slice(0, 3).map(([unit, amount]) => (
                        <TokenPill
                          key={unit}
                          unit={unit as Unit}
                          amount={amount}
                          chain={chain}
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
              </OverviewStat>

              <Suspense fallback={<AddressActivityStatsSkeleton />}>
                <AddressActivityStats
                  chain={chain}
                  address={normalizedAddress}
                />
              </Suspense>
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
