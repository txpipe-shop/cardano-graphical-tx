"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { type cardano, type Unit, type Value } from "@laceanatomy/types";
import { formatSeconds } from "~/app/_utils";
import ColoredAddress from "../ColoredAddress";
import CopyButton from "../CopyButton";
import TokenPill from "../TokenPill";

function OverviewStats({ tx }: { tx: cardano.Tx }) {
  return (
    <Card className="shadow-none border border-border bg-surface">
      <CardBody className="flex flex-row flex-wrap justify-around gap-4 p-4">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-p-secondary">Created:</p>
          <span className="text-p-secondary">{formatSeconds(tx.createdAt)}</span>
        </div>
        <div className="flex gap-2 items-center">
          <p className="font-bold text-p-secondary">Fee:</p>
          <span className="text-p-secondary">{Number(tx.fee)}</span>
        </div>
        <div className="flex gap-2 items-center">
          <p className="font-bold text-p-secondary">Block Height:</p>
          <span className="text-p-secondary">{tx.block?.height ?? "-"}</span>
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
      <CardBody className="p-0 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="text-p-secondary font-medium border-b bg-explorer-row">
            <tr>
              <th className="px-4 py-3">TxOut Ref</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Coin</th>
              <th className="px-4 py-3">Has Datum</th>
              <th className="px-4 py-3">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((utxo) => (
              <tr key={`${utxo.outRef.hash}#${utxo.outRef.index}`}>
                <td className="px-4 py-3 font-mono align-top text-p-secondary bg-surface">
                  <div className="flex items-center gap-1">
                    {utxo.outRef.hash.slice(0, 15)}...#
                    {utxo.outRef.index.toString()}
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
                  <Chip size="sm" variant="flat" className="bg-explorer-row text-p-secondary">
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
