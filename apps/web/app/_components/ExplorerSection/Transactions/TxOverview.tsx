"use client";

import { Card, CardBody, Chip, Tooltip } from "@heroui/react";
import { type cardano, type Unit, type Value } from "@laceanatomy/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatSeconds, ROUTES } from "~/app/_utils";
import { type Network } from "~/app/_utils/network-config";
import ColoredAddress from "../ColoredAddress";
import CopyButton from "../CopyButton";
import TokenPill from "../TokenPill";

function OverviewStats({ tx }: { tx: cardano.Tx }) {
  return (
    <Card className="shadow-none border border-border bg-surface">
      <CardBody className="flex flex-row flex-wrap justify-around gap-4 p-4">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-p-secondary">Created:</p>
          <span className="text-p-secondary">
            {formatSeconds(tx.createdAt)}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <p className="font-bold text-p-secondary">Fee:</p>
          <span className="text-p-secondary">{Number(tx.fee)}</span>
        </div>
        <div className="flex gap-2 items-center">
          <p className="font-bold text-p-secondary">Block Height:</p>
          <span className="text-p-secondary">{tx.block?.height?.toString() ?? "-"}</span>
        </div>
        {tx.validityInterval && (
          <>
            <div className="flex gap-2 items-center">
              <p className="font-bold text-p-secondary">Invalid Before:</p>
              <span className="text-p-secondary">
                {tx.validityInterval.invalidBefore ?? "-"}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <p className="font-bold text-p-secondary">Invalid Hereafter:</p>
              <span className="text-p-secondary">
                {tx.validityInterval.invalidHereafter ?? "-"}
              </span>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

function UtxoRefPill({ hash, index }: { hash: string; index: bigint }) {
  const params = useParams();
  const chain = (params?.chain as Network) ?? "mainnet";
  const fullRef = `${hash}#${index.toString()}`;

  return (
    <Tooltip content={fullRef} placement="top" delay={150}>
      <Link
        href={ROUTES.EXPLORER_TX(chain, hash)}
        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-mono text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
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

function UtxoList({
  title,
  list,
  mint,
}: {
  title: string;
  list: cardano.UTxO[];
  mint?: Value;
}) {
  if (list.length === 0) return null;
  return (
    <Card className="shadow-none border border-default-200">
      <div className="border-b px-4 py-2 bg-explorer-row font-semibold text-lg text-p-secondary">
        {title} ({list.length})
      </div>
      <CardBody className="p-0 md:hidden">
        <div className="space-y-4 p-4">
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
              <div>
                <p className="text-xs font-bold text-p-secondary">Address</p>
                <ColoredAddress address={utxo.address} />
              </div>
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
                  <Chip size="sm" variant="dot" color="success">
                    Yes
                  </Chip>
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
      </CardBody>
      <CardBody className="hidden p-0 md:block overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="text-p-secondary font-medium border-b bg-explorer-row">
            <tr>
              <th className="px-4 py-3">TxOut Ref</th>
              <th className="px-4 py-3">Address</th>
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
                <td className="px-4 py-3 font-mono align-top bg-surface">
                  <div className="flex items-center gap-2">
                    <ColoredAddress address={utxo.address} />
                  </div>
                </td>
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
      </CardBody>
    </Card>
  );
}

function MintList({ list }: { list: Value }) {
  if (Object.keys(list).length === 0) {
    return (
      <Card className="shadow-none border border-border bg-surface">
        <CardBody className="text-center text-p-secondary text-sm py-8">
          No minted assets in this transaction.
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border border-border bg-surface">
      <div className="border-b px-4 py-2 bg-background font-semibold text-lg text-p-primary">
        Minted Assets
      </div>
      <CardBody className="p-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(list).map(([unit, amount]) => (
            <TokenPill
              key={unit}
              unit={unit as Unit}
              amount={amount}
              mint={list}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

interface TxOverviewProps {
  tx: cardano.Tx;
}
export default function TxOverview({ tx }: TxOverviewProps) {
  return (
    <div className="space-y-6">
      <OverviewStats tx={tx} />
      <UtxoList title="Inputs" list={tx.inputs} mint={tx.mint} />
      <UtxoList title="Outputs" list={tx.outputs} mint={tx.mint} />
      {tx.referenceInputs && tx.referenceInputs.length > 0 ? (
        <UtxoList
          title="Reference Inputs"
          list={tx.referenceInputs}
          mint={tx.mint}
        />
      ) : (
        <Card className="shadow-none border border-border bg-surface">
          <CardBody className="text-center text-p-secondary text-sm py-2">
            No reference inputs in this transaction.
          </CardBody>
        </Card>
      )}
      <MintList list={tx.mint} />
    </div>
  );
}
