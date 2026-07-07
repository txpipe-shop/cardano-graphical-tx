"use client";

import { Chip, Tooltip } from "@heroui/react";
import type { cardano, Unit, Value } from "@laceanatomy/types";
import { isValidChain, type Network } from "@laceanatomy/types/cardano";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EmptyState } from "~/app/_components/EmptyState";
import ColoredAddress from "~/app/_components/ExplorerSection/ColoredAddress";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import DateViewer from "~/app/_components/ExplorerSection/DateViewer";
import TokenPill from "~/app/_components/ExplorerSection/TokenPill";
import { InfoCard } from "~/app/_components/InfoCard";
import { KeyValue } from "~/app/_components/KeyValue";
import { ROUTES } from "~/app/_utils";

function resolveChain(
  params: { chain?: string | string[] },
  prop?: Network,
): Network {
  const chain = prop ?? params?.chain;
  return typeof chain === "string" && isValidChain(chain) ? chain : "mainnet";
}

function OverviewStats({ tx }: { tx: cardano.Tx }) {
  return (
    <InfoCard shadow={false} border="solid" bg="background">
      <div className="flex flex-row flex-wrap justify-around gap-4">
        <KeyValue label="Created">
          <DateViewer timestamp={tx.createdAt} className="text-p-secondary" />
        </KeyValue>
        <KeyValue label="Fee" mono>
          {Number(tx.fee)}
        </KeyValue>
        <KeyValue label="Block Height" mono>
          {tx.block?.height?.toString() ?? "-"}
        </KeyValue>
        {tx.validityInterval && (
          <>
            <KeyValue label="Invalid Before" mono>
              {tx.validityInterval.invalidBefore ?? "-"}
            </KeyValue>
            <KeyValue label="Invalid Hereafter" mono>
              {tx.validityInterval.invalidHereafter ?? "-"}
            </KeyValue>
          </>
        )}
      </div>
    </InfoCard>
  );
}

function UtxoRefPill({ hash, index }: { hash: string; index: bigint }) {
  const params = useParams();
  const chain = resolveChain(params);
  const fullRef = `${hash}#${index.toString()}`;

  return (
    <Tooltip content={fullRef} placement="top" delay={150}>
      <Link
        href={ROUTES.EXPLORER_TX(chain, hash)}
        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-p-primary shadow-sm transition-colors hover:bg-surface whitespace-nowrap"
      >
        <ExternalLinkIcon />
        {hash.slice(0, 8)}…#{index.toString()}
      </Link>
    </Tooltip>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function UtxoList({
  title,
  list,
  mint,
  showAddress = true,
  linkTxHash,
}: {
  title?: string;
  list: cardano.UTxO[];
  mint?: Value;
  showAddress?: boolean;
  linkTxHash?: string;
}) {
  const params = useParams();
  const chain = (params?.chain as Network) ?? "mainnet";
  if (list.length === 0) return null;
  return (
    <InfoCard
      header={title ? `${title} (${list.length})` : undefined}
      shadow={false}
      border="solid"
    >
      <div className="p-0 md:hidden">
        <div className="space-y-4">
          {list.map((utxo) => (
            <div
              key={`${utxo.outRef.hash}#${utxo.outRef.index}`}
              className="space-y-2 rounded-lg border border-border bg-surface p-3"
            >
              <div>
                <p className="text-xs font-bold text-p-secondary">TxOut Ref</p>
                <div className="flex items-center gap-1">
                  <UtxoRefPill
                    hash={utxo.outRef.hash}
                    index={utxo.outRef.index}
                  />
                  <CopyButton
                    text={`${utxo.outRef.hash}#${utxo.outRef.index}`}
                    size={12}
                  />
                </div>
              </div>
              {showAddress && (
                <div>
                  <p className="text-xs font-bold text-p-secondary">Address</p>
                  <ColoredAddress address={utxo.address} chain={chain} />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-p-secondary">Coin</p>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-explorer-row text-p-secondary"
                >
                  {utxo.coin ? utxo.coin.toString() : "-"}
                </Chip>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-p-secondary">Has Datum</p>
                {utxo.datum ? (
                  <Link
                    href={`${ROUTES.EXPLORER_TX(chain, linkTxHash ?? utxo.outRef.hash)}?tab=Datum&txOutRef=${encodeURIComponent(`${utxo.outRef.hash}#${utxo.outRef.index.toString()}`)}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-p-secondary shadow-sm transition-colors hover:bg-explorer-row"
                  >
                    <span className="text-success">
                      <ExternalLinkIcon />
                    </span>
                    View
                  </Link>
                ) : (
                  <Chip size="sm" variant="dot" color="danger">
                    No
                  </Chip>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-p-secondary">Has Script</p>
                {utxo.referenceScript ? (
                  <Chip size="sm" variant="dot" color="success">
                    Yes
                  </Chip>
                ) : (
                  <Chip size="sm" variant="dot" color="danger">
                    No
                  </Chip>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-p-secondary">Tokens</p>
                {Object.keys(utxo.value).length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(utxo.value).map(([unit, amount]) => (
                      <TokenPill
                        key={unit}
                        unit={unit as Unit}
                        amount={amount}
                        mint={mint ?? {}}
                        chain={chain}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-p-secondary">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden p-0 md:block overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="text-p-secondary font-medium border-b bg-explorer-row">
            <tr>
              <th className="px-4 py-3">TxOut Ref</th>
              {showAddress && <th className="px-4 py-3">Address</th>}
              <th className="px-4 py-3">Coin</th>
              <th className="px-4 py-3">Has Datum</th>
              <th className="px-4 py-3">Has Script</th>
              <th className="px-4 py-3">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((utxo) => (
              <tr key={`${utxo.outRef.hash}#${utxo.outRef.index}`}>
                <td className="px-4 py-3 align-top bg-surface">
                  <div className="flex items-center gap-1">
                    <UtxoRefPill
                      hash={utxo.outRef.hash}
                      index={utxo.outRef.index}
                    />
                    <CopyButton
                      text={`${utxo.outRef.hash}#${utxo.outRef.index}`}
                      size={12}
                    />
                  </div>
                </td>
                {showAddress && (
                  <td className="px-4 py-3 font-mono align-top bg-surface">
                    <div className="flex items-center gap-2">
                      <ColoredAddress address={utxo.address} chain={chain} />
                    </div>
                  </td>
                )}
                <td className="px-4 py-3 font-mono align-top bg-surface">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-explorer-row text-p-secondary"
                  >
                    {utxo.coin ? utxo.coin.toString() : "-"}
                  </Chip>
                </td>
                <td className="px-4 py-3 align-top bg-surface">
                  {utxo.datum ? (
                    <Link
                      href={`${ROUTES.EXPLORER_TX(chain, linkTxHash ?? utxo.outRef.hash)}?tab=Datum&txOutRef=${encodeURIComponent(`${utxo.outRef.hash}#${utxo.outRef.index.toString()}`)}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-p-secondary shadow-sm transition-colors hover:bg-explorer-row"
                    >
                      <span className="text-success">
                        <ExternalLinkIcon />
                      </span>
                      View
                    </Link>
                  ) : (
                    <Chip size="sm" variant="dot" color="danger">
                      No
                    </Chip>
                  )}
                </td>
                <td className="px-4 py-3 align-top bg-surface">
                  {utxo.referenceScript ? (
                    <Chip size="sm" variant="dot" color="success">
                      Yes
                    </Chip>
                  ) : (
                    <Chip size="sm" variant="dot" color="danger">
                      No
                    </Chip>
                  )}
                </td>

                <td className="px-4 py-3 align-top bg-surface">
                  {Object.keys(utxo.value).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(utxo.value).map(([unit, amount]) => (
                        <TokenPill
                          key={unit}
                          unit={unit as Unit}
                          amount={amount}
                          mint={mint ?? {}}
                          chain={chain}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-p-secondary">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InfoCard>
  );
}

function MintList({
  list,
  chain: chainProp,
}: Readonly<{
  list: Value;
  chain?: Network;
}>) {
  const params = useParams();
  const chain = resolveChain(params, chainProp);
  if (Object.keys(list).length === 0) {
    return <EmptyState message="No minted assets in this transaction." />;
  }

  return (
    <InfoCard
      header="Minted Assets"
      shadow={false}
      border="solid"
      bg="background"
    >
      <div className="flex flex-wrap gap-2">
        {Object.entries(list).map(([unit, amount]) => (
          <TokenPill
            key={unit}
            unit={unit as Unit}
            amount={amount}
            mint={list}
            chain={chain}
          />
        ))}
      </div>
    </InfoCard>
  );
}

interface TxOverviewProps {
  tx: cardano.Tx;
}
export default function TxOverview({ tx }: TxOverviewProps) {
  const params = useParams();
  const chain = resolveChain(params);
  return (
    <div className="space-y-6">
      <OverviewStats tx={tx} />
      <UtxoList
        title="Inputs"
        list={tx.inputs}
        mint={tx.mint}
        linkTxHash={tx.hash}
      />
      <UtxoList
        title="Outputs"
        list={tx.outputs}
        mint={tx.mint}
        linkTxHash={tx.hash}
      />
      {tx.referenceInputs && tx.referenceInputs.length > 0 ? (
        <UtxoList
          title="Reference Inputs"
          list={tx.referenceInputs}
          mint={tx.mint}
          linkTxHash={tx.hash}
        />
      ) : (
        <EmptyState message="No reference inputs in this transaction." />
      )}
      <MintList list={tx.mint} chain={chain} />
    </div>
  );
}
