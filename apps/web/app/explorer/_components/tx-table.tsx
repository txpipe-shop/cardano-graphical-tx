"use client";

import { Badge, Button, Card, CardBody, Link, Tooltip } from "@heroui/react";
import { bech32 } from "bech32";
import { useRouter } from "next/navigation";

// Local type definitions matching the @laceanatomy/types cardano types
interface Script {
  type?: "native" | "plutusV1" | "plutusV2" | "plutusV3";
  bytes?: string;
  hash?: string;
}

interface UTxO {
  outRef: { hash: string; index: bigint };
  address: string;
  coin: bigint;
  value: Record<string, bigint>;
  referenceScript?: Script;
}

interface Tx {
  hash: string;
  fee: bigint;
  inputs: UTxO[];
  outputs: UTxO[];
  mint?: Record<string, bigint>;
  createdAt?: number;
  witnesses?: { redeemers?: unknown[]; scripts?: Script[] };
  referenceInputs?: UTxO[];
  indexInBlock: bigint;
}

interface TxTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[];
  chain: string;
}

function formatDate(s?: number): string {
  if (!s) return "-";
  try {
    return new Date(s * 1000).toLocaleString();
  } catch {
    return "-";
  }
}

function truncateString(str: string, length = 20): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...${str.slice(-length)}`;
}

function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

function hexToBech32(hex: string, prefix: string): string {
  try {
    const bytes = hexToBytes(hex);
    const words = bech32.toWords(new Uint8Array(bytes));
    return bech32.encode(prefix, words, 1000);
  } catch {
    return hex;
  }
}

function hexToAscii(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.slice(i, i + 2), 16);
    if (charCode >= 32 && charCode <= 126) {
      str += String.fromCharCode(charCode);
    }
  }
  return str;
}

function formatAddress(address: string): string {
  if (!address) return "No address found";
  try {
    const bech32Addr = hexToBech32(address, "addr");
    return `${bech32Addr.slice(0, 12)}...${bech32Addr.slice(-8)}`;
  } catch {
    return truncateString(address, 10);
  }
}

function getAssetName(policyAndName: string): string {
  if (policyAndName.length <= 56) return `(${policyAndName.slice(0, 8)}...)`;
  const nameHex = policyAndName.slice(56);
  try {
    const name = hexToAscii(nameHex);
    if (!name || name.trim() === "") return "(empty)";
    return truncateString(name, 15);
  } catch {
    return truncateString(nameHex, 15);
  }
}

function getBadgeColor(
  assetId: string,
  mintedAssets: Record<string, bigint> | undefined
): "success" | "danger" | "default" {
  if (mintedAssets && assetId in mintedAssets) {
    const amount = mintedAssets[assetId];
    if (amount && amount > 0n) return "success";
    if (amount && amount < 0n) return "danger";
  }
  return "default";
}

function getScriptBadges(
  tx: Tx
): { type: string; color: "warning" | "secondary" | "primary" | "danger" }[] {
  const badges: {
    type: string;
    color: "warning" | "secondary" | "primary" | "danger";
  }[] = [];
  const scriptsList = tx.witnesses?.scripts ?? [];
  const refScriptsList =
    tx.referenceInputs
      ?.map((ri) => ri.referenceScript)
      .filter((s): s is Script => !!s) ?? [];
  const allScripts = [...scriptsList, ...refScriptsList];

  if (allScripts.some((s) => s.type === "native")) {
    badges.push({ type: "Native", color: "warning" });
  }
  if (allScripts.some((s) => s.type === "plutusV1")) {
    badges.push({ type: "Plutus V1", color: "secondary" });
  }
  if (allScripts.some((s) => s.type === "plutusV2")) {
    badges.push({ type: "Plutus V2", color: "primary" });
  }
  if (allScripts.some((s) => s.type === "plutusV3")) {
    badges.push({ type: "Plutus V3", color: "danger" });
  }

  return badges;
}

function CopyButton({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Tooltip content="Copy to clipboard">
      <button
        onClick={handleCopy}
        className="ml-1 text-gray-400 transition-colors hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
    </Tooltip>
  );
}

function TxRow({ tx, chain }: { tx: Tx; chain: string }) {
  const router = useRouter();
  const scriptBadges = getScriptBadges(tx);

  const handleDissect = () => {
    router.push(`/tx/dissect?tx=${tx.hash}&chain=${chain}`);
  };

  const handleDraw = () => {
    router.push(`/tx/grapher?tx=${tx.hash}&chain=${chain}`);
  };

  return (
    <Card className="mb-4 border-2 border-dashed border-gray-200 shadow-md">
      <CardBody className="p-0">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-violet-100 p-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
            <Link
              href={`/tx/dissect?tx=${tx.hash}&chain=${chain}`}
              className="font-mono text-sm text-blue-600 hover:underline"
            >
              {truncateString(tx.hash, 16)}
            </Link>
            <CopyButton text={tx.hash} />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(tx.createdAt)}
          </div>

          <div className="text-sm font-medium">
            Fee: {(Number(tx.fee) / 1_000_000).toFixed(6)} ₳
          </div>

          <div className="flex items-center gap-2">
            {scriptBadges.map((badge, idx) => (
              <Badge key={idx} color={badge.color} variant="flat" size="sm">
                {badge.type}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              className="font-mono shadow-md"
              onClick={handleDissect}
            >
              Dissect
            </Button>
            <Button
              size="sm"
              variant="flat"
              className="font-mono shadow-md"
              onClick={handleDraw}
            >
              Draw
            </Button>
          </div>
        </div>

        {/* Inputs/Outputs Row */}
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          {/* Inputs */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-500">
              Inputs ({tx.inputs.length})
            </h4>
            <div className="space-y-2">
              {tx.inputs.slice(0, 3).map((utxo: UTxO) => (
                <UtxoItem
                  key={`${utxo.outRef.hash}-${utxo.outRef.index}`}
                  utxo={utxo}
                  mints={tx.mint}
                />
              ))}
              {tx.inputs.length > 3 && (
                <p className="text-xs text-gray-400">
                  + {tx.inputs.length - 3} more inputs
                </p>
              )}
            </div>
          </div>

          {/* Outputs */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-500">
              Outputs ({tx.outputs.length})
            </h4>
            <div className="space-y-2">
              {tx.outputs.slice(0, 3).map((utxo: UTxO) => (
                <UtxoItem
                  key={`${utxo.outRef.hash}-${utxo.outRef.index}`}
                  utxo={utxo}
                  mints={tx.mint}
                />
              ))}
              {tx.outputs.length > 3 && (
                <p className="text-xs text-gray-400">
                  + {tx.outputs.length - 3} more outputs
                </p>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function UtxoItem({
  utxo,
  mints,
}: {
  utxo: UTxO;
  mints?: Record<string, bigint>;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-2">
      <div className="flex items-center gap-2">
        <Badge color="secondary" variant="flat" size="sm">
          {(Number(utxo.coin) / 1_000_000).toFixed(2)} ₳
        </Badge>
        <span className="font-mono text-xs text-gray-600">
          {formatAddress(utxo.address)}
        </span>
        <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-mono text-xs font-bold text-transparent">
          {(() => {
            try {
              const bech32Addr = hexToBech32(utxo.address, "addr");
              return bech32Addr.slice(-5);
            } catch {
              return utxo.address.slice(-5);
            }
          })()}
        </span>
      </div>
      {Object.keys(utxo.value).length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {Object.entries(utxo.value)
            .slice(0, 3)
            .map(([unit, amount]) => (
              <Badge
                key={unit}
                color={getBadgeColor(unit, mints)}
                variant="flat"
                size="sm"
                className="text-xs"
              >
                {getAssetName(unit)}: {String(amount)}
              </Badge>
            ))}
          {Object.keys(utxo.value).length > 3 && (
            <Badge variant="flat" size="sm" className="text-xs">
              +{Object.keys(utxo.value).length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export function TxTable({ transactions, chain }: TxTableProps) {
  if (transactions.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 shadow-md">
        <CardBody className="py-8 text-center text-gray-500">
          No transactions found for this network.
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx: Tx) => (
        <TxRow key={tx.hash} tx={tx} chain={chain} />
      ))}
    </div>
  );
}
