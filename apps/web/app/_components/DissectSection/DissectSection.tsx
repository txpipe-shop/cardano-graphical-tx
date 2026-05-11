"use client";

import { Button, Card, CardBody } from "@heroui/react";
import type {
  Assets,
  Certificate,
  Collateral as CollateralType,
  Metadata,
  Withdrawal as WithdrawalType,
  Witnesses,
} from "@laceanatomy/napi-pallas";
import { Address } from "@laceanatomy/types";
import { useMemo, useState } from "react";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { useUI } from "~/app/_contexts";
import type { IGraphicalTransaction, IGraphicalUtxo } from "~/app/_interfaces";
import { JSONBIG } from "~/app/_utils";
import Loading from "~/app/loading";
import ColoredAddress from "../ExplorerSection/ColoredAddress";
import TOPICS from "./topics";
import { formatAda } from "./utils";

type SidebarItem = {
  group: string;
  key: string;
  label: string;
  content: React.ReactNode;
};

const GROUP_TOPIC_KEY: Record<string, keyof typeof TOPICS | undefined> = {
  Inputs: "inputs",
  Outputs: "outputs",
  "Ref Inputs": "reference_inputs",
  Mints: "mints",
  Metadata: "metadata",
  Witnesses: "witnesses",
};

export function DissectSection({ tx }: { tx: IGraphicalTransaction }) {
  const { loading } = useUI();
  const [activeKey, setActiveKey] = useState<string>("");

  const items = useMemo(() => {
    const normalInputs = tx.inputs.filter((i) => !i.isReferenceInput);
    const referenceInputs = tx.inputs.filter((i) => i.isReferenceInput);
    const certs: Certificate[] = tx.certificates ?? [];
    const wd: WithdrawalType[] = tx.withdrawals ?? [];
    const meta: Metadata[] = tx.metadata ?? [];
    const col = tx.collateral ?? { inputs: [], collateralReturn: [], total: 0 };
    const wit = tx.witnesses ?? {
      vkeyWitnesses: [],
      redeemers: [],
      plutusData: [],
      plutusV1Scripts: [],
      plutusV2Scripts: [],
      plutusV3Scripts: [],
    };

    const result: SidebarItem[] = [];

    normalInputs.forEach((utxo, i) => {
      result.push({
        group: "Inputs",
        key: `input-${i}`,
        label: `#${i}  ${utxo.txHash}#${utxo.index}`,
        content: <UtxoDetail utxo={utxo} />,
      });
    });
    tx.outputs.forEach((utxo, i) => {
      result.push({
        group: "Outputs",
        key: `output-${i}`,
        label: `#${i}  ${utxo.txHash}#${utxo.index}`,
        content: <UtxoDetail utxo={utxo} />,
      });
    });
    referenceInputs.forEach((utxo, i) => {
      result.push({
        group: "Ref Inputs",
        key: `ref-${i}`,
        label: `#${i}  ${utxo.txHash}#${utxo.index}`,
        content: <UtxoDetail utxo={utxo} />,
      });
    });
    certs.forEach((cert, i) => {
      result.push({
        group: "Certificates",
        key: `cert-${i}`,
        label: `#${i}  ${cert.kind}`,
        content: <CertDetail cert={cert} />,
      });
    });
    wd.forEach((w, i) => {
      result.push({
        group: "Withdrawals",
        key: `wd-${i}`,
        label: `#${i}  ${formatAda(w.amount)} ₳`,
        content: <WithdrawalDetail w={w} />,
      });
    });
    tx.mints.forEach((mint, i) => {
      const isMint = mint.assetsPolicy.some((a) => a.amount && a.amount > 0);
      result.push({
        group: "Mints",
        key: `mint-${i}`,
        label: `#${i}  ${isMint ? "Mint" : "Burn"}`,
        content: <MintDetail mint={mint} isMint={isMint} />,
      });
    });
    meta.forEach((m, i) => {
      result.push({
        group: "Metadata",
        key: `meta-${i}`,
        label: `#${i}  Label ${m.label}`,
        content: <MetadataDetail m={m} />,
      });
    });
    if (
      col &&
      ((col.collateralReturn?.length ?? 0) > 0 ||
        (col.inputs?.length ?? 0) > 0 ||
        col.total !== undefined)
    ) {
      result.push({
        group: "Collateral",
        key: "collateral",
        label: "Collateral",
        content: <CollateralDetail col={col} />,
      });
    }
    if (wit) {
      const vkeys = wit.vkeyWitnesses ?? [];
      const redeemers = wit.redeemers ?? [];
      const plutus = wit.plutusData ?? [];
      if (vkeys.length > 0)
        result.push({
          group: "Witnesses",
          key: "witness-vkey",
          label: `VKey (${vkeys.length})`,
          content: <VKeyDetail items={vkeys} />,
        });
      redeemers.forEach((r, i) => {
        result.push({
          group: "Witnesses",
          key: `witness-red-${i}`,
          label: `Redeemer #${i}  ${r.tag} @${r.index}`,
          content: <RedeemerDetail r={r} />,
        });
      });
      plutus.forEach((d, i) => {
        result.push({
          group: "Witnesses",
          key: `witness-plutus-${i}`,
          label: `Plutus #${i}  ${d.hash}`,
          content: <PlutusDetail d={d} />,
        });
      });
    }

    return result;
  }, [tx]);

  if (loading) return <Loading />;

  const grouped = new Map<string, SidebarItem[]>();
  for (const item of items) {
    if (!grouped.has(item.group)) grouped.set(item.group, []);
    grouped.get(item.group)!.push(item);
  }

  const activeItem = items.find((i) => i.key === activeKey) ?? items[0];
  if (activeKey === "" && items[0]) {
    setActiveKey(items[0].key);
  }

  const normalInputs = tx.inputs.filter((i) => !i.isReferenceInput);

  return (
    <div className="flex flex-col min-h-0 w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4 mb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-mono text-base font-bold text-accent-blue">
            {tx.era}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-6 md:gap-y-2 flex-shrink-0 md:ml-auto">
          <Stat label="Fee" value={formatAda(tx.fee)} suffix="₳" />
          <Stat label="Size" value={`${tx.size}`} suffix="B" />
          <Stat label="Inputs" value={`${normalInputs.length}`} />
          <Stat label="Outputs" value={`${tx.outputs.length}`} />
          {tx.blockHeight !== undefined && (
            <Stat label="Block height" value={`${tx.blockHeight.toFixed(0)}`} />
          )}
        </div>
      </div>

      <Card className="shadow-none border border-border bg-surface flex-1 min-h-0">
        <CardBody className="flex flex-col gap-6 p-0 md:flex-row min-h-0">
          <div className="flex flex-col gap-3 border-r border-border min-w-[220px] max-w-[260px] overflow-y-auto p-4">
            {[...grouped.entries()].map(([group, groupItems]) => (
              <div key={group} className="flex flex-col gap-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-p-secondary px-1">
                  {group} ({groupItems.length})
                </div>
                {groupItems.map((item) => {
                  const isActive = item.key === (activeItem?.key ?? "");
                  return (
                    <Button
                      key={item.key}
                      size="sm"
                      variant={isActive ? "solid" : "ghost"}
                      color={isActive ? "primary" : "default"}
                      className="justify-start font-mono text-xs min-w-0"
                      onPress={() => setActiveKey(item.key)}
                    >
                      <span className="truncate">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4 pt-4">
            {activeItem && GROUP_TOPIC_KEY[activeItem.group] && (
              <p className="mb-4 text-xs text-p-secondary leading-relaxed border-b border-border pb-3">
                {TOPICS[GROUP_TOPIC_KEY[activeItem.group]!]}
              </p>
            )}
            {activeItem?.content ?? (
              <div className="py-20 text-center">
                <p className="text-5xl font-extrabold text-border">0</p>
                <p className="mt-3 text-base text-p-secondary">
                  No items to display
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function UtxoDetail({ utxo }: { utxo: IGraphicalUtxo }) {
  return (
    <div className="space-y-4">
      <div>
        <DetailLabel>Transaction Output Reference</DetailLabel>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold break-all">
            {utxo.txHash}#{utxo.index}
          </span>
          <CopyButton text={`${utxo.txHash}#${utxo.index}`} size={14} />
        </div>
      </div>

      {utxo.address && (
        <div>
          <DetailLabel>Address</DetailLabel>
          <div className="flex items-center gap-2 mb-2">
            <ColoredAddress address={Address(utxo.address.bech32)} full />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SubField label="Header Type" value={utxo.address.headerType} />
            <SubField label="Network" value={utxo.address.netType} />
            <SubField label="Kind" value={utxo.address.kind} />
            <SubField label="Payment" value={utxo.address.payment} mono />
            {utxo.address.delegation && (
              <SubField
                label="Delegation"
                value={utxo.address.delegation}
                mono
              />
            )}
          </div>
        </div>
      )}

      <div>
        <DetailLabel>Lovelace</DetailLabel>
        <span className="font-mono text-lg font-extrabold">
          {utxo.lovelace}
          <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
        </span>
      </div>

      {utxo.datum && (
        <div>
          <DetailLabel>Datum</DetailLabel>
          <div className="font-mono text-sm break-all text-p-primary">
            {utxo.datum.hash}
          </div>
          {utxo.datum.bytes && (
            <pre className="mt-2 text-xs font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-60 overflow-y-auto border border-border bg-explorer-row/30 p-3 rounded">
              {utxo.datum.bytes}
            </pre>
          )}
        </div>
      )}

      {utxo.scriptRef && (
        <div>
          <DetailLabel>Script Reference</DetailLabel>
          <div className="font-mono text-sm break-all">{utxo.scriptRef}</div>
        </div>
      )}

      <AssetsList assets={utxo.assets} />
    </div>
  );
}

function AssetsList({ assets }: { assets: Assets[] }) {
  if (!assets || assets.length === 0) return null;
  return (
    <div>
      <DetailLabel>
        Assets ({assets.reduce((s, a) => s + a.assetsPolicy.length, 0)})
      </DetailLabel>
      <div className="space-y-2 mt-1">
        {assets.map(({ policyId, assetsPolicy }, j) => (
          <div
            key={j}
            className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-p-secondary">Policy</span>
              <span className="font-mono text-xs break-all">{policyId}</span>
            </div>
            <div className="space-y-px">
              {assetsPolicy.map((a, k) => (
                <div
                  key={k}
                  className="flex items-center gap-3 text-sm w-full justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-p-secondary">
                      Hex name
                    </span>
                    <span className="font-mono flex-1 min-w-0 truncate">
                      {a.assetName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-p-secondary">
                      Ascii name
                    </span>
                    <span className="text-p-secondary flex-shrink-0 max-w-[160px] truncate">
                      {a.assetNameAscii || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-p-secondary">
                      Amount
                    </span>
                    <span className="font-mono font-bold flex-shrink-0 w-36 text-right text-xs">
                      {a.amount?.toFixed(0) ?? 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertDetail({ cert }: { cert: Certificate }) {
  return (
    <div className="space-y-3">
      <DetailLabel>{cert.kind}</DetailLabel>
      <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
        {JSON.stringify(cert, null, 2)}
      </pre>
    </div>
  );
}

function WithdrawalDetail({ w }: { w: WithdrawalType }) {
  return (
    <div className="space-y-4">
      <div>
        <DetailLabel>Address</DetailLabel>
        <ColoredAddress address={Address(w.rawAddress)} full />
        <div className="font-mono text-sm break-all">{w.rawAddress}</div>
      </div>
      <div>
        <DetailLabel>Amount</DetailLabel>
        <span className="font-mono text-lg font-extrabold">
          {formatAda(w.amount)}
          <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
        </span>
      </div>
    </div>
  );
}

function MintDetail({ mint, isMint }: { mint: Assets; isMint: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DetailLabel>Policy ID</DetailLabel>
        <span
          className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${isMint ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
        >
          {isMint ? "MINT" : "BURN"}
        </span>
      </div>
      <div className="font-mono text-sm break-all">{mint.policyId}</div>
      <DetailLabel>Assets</DetailLabel>
      <div className="space-y-px border border-border/50 rounded">
        {mint.assetsPolicy.map((a, j) => (
          <div
            key={j}
            className="flex items-center gap-3 px-3 py-2 bg-explorer-row/30 text-sm"
          >
            <span className="font-mono flex-1 min-w-0 truncate">
              {a.assetName}
            </span>
            <span className="text-p-secondary flex-shrink-0 max-w-[160px] truncate">
              {a.assetNameAscii || "—"}
            </span>
            <span className="font-mono font-bold flex-shrink-0 w-24 text-right">
              {a.amount?.toFixed(0) ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetadataDetail({ m }: { m: Metadata }) {
  return (
    <div className="space-y-3">
      <DetailLabel>Label: {m.label}</DetailLabel>
      <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
        {JSONBIG.stringify(m.jsonMetadata, null, 2)}
      </pre>
    </div>
  );
}

function CollateralDetail({ col }: { col: CollateralType }) {
  return (
    <div className="space-y-4">
      {col.total !== undefined && (
        <div>
          <DetailLabel>Total</DetailLabel>
          <span className="font-mono text-2xl font-extrabold">
            {col.total}
          </span>
        </div>
      )}

      {col.inputs && col.inputs.length > 0 && (
        <div>
          <DetailLabel>Collateral Inputs</DetailLabel>
          <div className="space-y-1 mt-1">
            {col.inputs.map((inp, i) => (
              <div
                key={i}
                className="flex items-center gap-2 font-mono text-sm break-all border border-border bg-explorer-row/30 px-3 py-2 rounded"
              >
                <span>
                  {inp.txHash}#{inp.index}
                </span>
                <CopyButton text={`${inp.txHash}#${inp.index}`} size={12} />
              </div>
            ))}
          </div>
        </div>
      )}

      {col.collateralReturn && col.collateralReturn.length > 0 && (
        <div>
          <DetailLabel>Collateral Return</DetailLabel>
          <div className="space-y-3 mt-1">
            {col.collateralReturn.map((ref, i) => (
              <div
                key={i}
                className="border border-border bg-explorer-row/30 rounded p-3 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold break-all">
                    {ref.txHash}#{ref.index}
                  </span>
                  <CopyButton text={`${ref.txHash}#${ref.index}`} size={14} />
                </div>

                <div>
                  <DetailLabel>Address</DetailLabel>
                  <ColoredAddress address={Address(ref.address)} full />
                </div>

                <div>
                  <DetailLabel>Lovelace</DetailLabel>
                  <span className="font-mono text-lg font-extrabold">
                    {ref.lovelace}
                  </span>
                </div>

                {ref.datum && (
                  <div>
                    <DetailLabel>Datum</DetailLabel>
                    <div className="font-mono text-sm break-all text-p-primary">
                      {ref.datum.hash}
                    </div>
                    {ref.datum.bytes && (
                      <pre className="mt-2 text-xs font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-60 overflow-y-auto border border-border bg-explorer-row/30 p-3 rounded">
                        {ref.datum.bytes}
                      </pre>
                    )}
                  </div>
                )}

                {ref.scriptRef && (
                  <div>
                    <DetailLabel>Script Reference</DetailLabel>
                    <div className="font-mono text-sm break-all">
                      {ref.scriptRef}
                    </div>
                  </div>
                )}

                <AssetsList assets={ref.assets} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VKeyDetail({ items }: { items: Witnesses["vkeyWitnesses"] }) {
  return (
    <div className="space-y-2">
      {items.map((w, i) => (
        <div key={i} className="border border-border bg-surface rounded">
          <div className="px-4 py-2 bg-explorer-row border-b border-border flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-p-primary">
              #{i}
            </span>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-start gap-4 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-p-secondary w-16 flex-shrink-0 pt-px">
                Key
              </span>
              <span className="font-mono text-sm break-all">{w.key}</span>
            </div>
            <div className="flex items-start gap-4 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-p-secondary w-16 flex-shrink-0 pt-px">
                Hash
              </span>
              <span className="font-mono text-sm break-all">{w.hash}</span>
            </div>
            <div className="flex items-start gap-4 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-p-secondary w-16 flex-shrink-0 pt-px">
                Sig
              </span>
              <span className="font-mono text-sm break-all">{w.signature}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RedeemerDetail({ r }: { r: Witnesses["redeemers"][number] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-bold">{r.tag}</span>
        <span className="font-mono text-xs text-p-secondary">
          index {r.index}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <DetailLabel>Ex Mem</DetailLabel>
          <span className="font-mono text-sm">{r.exUnits.mem.toFixed(0)}</span>
        </div>
        <div>
          <DetailLabel>Ex Steps</DetailLabel>
          <span className="font-mono text-sm">
            {r.exUnits.steps.toFixed(0)}
          </span>
        </div>
      </div>
      <div>
        <DetailLabel>Data</DetailLabel>
        <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
          {JSONBIG.stringify(JSON.parse(r.dataJson), null, 2)}
        </pre>
      </div>
    </div>
  );
}

function PlutusDetail({ d }: { d: Witnesses["plutusData"][number] }) {
  return (
    <div className="space-y-3">
      <div>
        <DetailLabel>Hash</DetailLabel>
        <div className="font-mono text-sm break-all">{d.hash}</div>
      </div>
      {d.bytes && (
        <div>
          <DetailLabel>Bytes</DetailLabel>
          <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-60 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
            {d.bytes}
          </pre>
        </div>
      )}
      {d.json && (
        <div>
          <DetailLabel>JSON</DetailLabel>
          <pre className="text-sm font-mono text-p-primary whitespace-pre-wrap break-all overflow-x-auto max-h-96 overflow-y-auto border border-border bg-explorer-row/30 p-4 rounded">
            {d.json}
          </pre>
        </div>
      )}
    </div>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider text-p-secondary mb-1.5">
      {children}
    </p>
  );
}

function SubField({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-p-secondary">{label}</p>
      <p className={`text-sm break-all ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5 flex-shrink-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-p-secondary">
        {label}
      </span>
      <span className="font-mono text-sm font-bold text-p-primary tabular-nums">
        {value}
        {suffix && (
          <span className="ml-0.5 text-xs font-medium text-p-secondary">
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}
