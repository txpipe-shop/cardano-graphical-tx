import { type Address, type Unit } from "@laceanatomy/types";
import { cache } from "react";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import Pagination from "~/app/_components/ExplorerSection/Pagination";
import TokenPill from "~/app/_components/ExplorerSection/TokenPill";
import { DEFAULT_DEVNET_PORT } from "~/app/_utils/constants";
import { formatAda } from "~/app/_utils/explorer";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getDolosProvider } from "~/server/api/dolos-provider";
import { getU5CProviderNode } from "~/server/api/u5c-provider";

const PAGE_SIZE = 20n;

interface AddressUTxOsListProps {
  chain: Network;
  address: Address;
  page: number;
  basePath: string;
}

function resolveProvider(chain: Network) {
  if (chain === NETWORK.DEVNET) {
    return getU5CProviderNode(Number.parseInt(DEFAULT_DEVNET_PORT, 10));
  }
  return getDolosProvider(chain);
}

export const getAddressUTxOsPage = cache(
  async ({
    chain,
    address,
    page,
  }: Readonly<Pick<AddressUTxOsListProps, "chain" | "address" | "page">>) => {
    const provider = resolveProvider(chain);
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const offset = BigInt(currentPage - 1) * PAGE_SIZE;

    return provider.getAddressUTxOs({
      query: { address },
      limit: PAGE_SIZE,
      offset,
    });
  },
);

export async function AddressUTxOsList({
  chain,
  address,
  page,
  basePath,
}: Readonly<AddressUTxOsListProps>) {
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;

  let utxos: Awaited<ReturnType<typeof getAddressUTxOsPage>>["data"] = [];
  let total = 0n;

  try {
    const response = await getAddressUTxOsPage({
      chain,
      address,
      page: currentPage,
    });
    utxos = response.data;
    total = response.total;
  } catch (err) {
    console.error(err);
  }

  if (total === 0n) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center text-p-secondary shadow-md">
        No UTxOs found for this address.
      </div>
    );
  }

  const totalPages = Number((total - 1n) / PAGE_SIZE + 1n);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {utxos.map((utxo) => {
          const outRef = `${utxo.outRef.hash}#${utxo.outRef.index.toString()}`;
          const tokens = Object.entries(utxo.value).filter(
            ([unit]) => unit !== "lovelace",
          );

          return (
            <div
              key={outRef}
              className="rounded-lg border-2 border-dashed border-border bg-surface p-4 shadow-md"
            >
              <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-p-secondary">
                  <span>
                    {utxo.outRef.hash.slice(0, 10)}...
                    {utxo.outRef.hash.slice(-10)}#{utxo.outRef.index.toString()}
                  </span>
                  <CopyButton text={outRef} size={12} />
                </div>

                <div className="shrink-0 text-sm font-medium text-p-primary">
                  {formatAda(utxo.value["lovelace" as Unit] ?? utxo.coin)}
                </div>

                <div className="flex items-center gap-2">
                  {utxo.datum && (
                    <span className="rounded-full border border-border bg-explorer-row px-2 py-0.5 text-xs font-medium text-p-secondary">
                      Datum
                    </span>
                  )}
                </div>
              </div>

              {tokens.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tokens.map(([unit, amount]) => (
                    <TokenPill
                      key={unit}
                      unit={unit as Unit}
                      amount={amount as bigint}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {total > PAGE_SIZE && (
        <Pagination
          basePath={basePath}
          currentPage={currentPage}
          totalPages={Math.max(totalPages, 1)}
        />
      )}
    </div>
  );
}
