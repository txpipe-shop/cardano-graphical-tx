"use client";

import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import type {
  Assets,
  Bootstrap,
  Certificate,
  Collateral as CollateralType,
  Metadata,
  ProposalProcedure,
  VotingProcedureEntry,
  RewardWithdrawal as WithdrawalType,
  Witnesses,
} from "@laceanatomy/napi-pallas";
import { Address } from "@laceanatomy/types";
import { useCallback, useMemo, useState } from "react";
import { CodeBlock } from "~/app/_components/CodeBlock";
import { DetailLabel } from "~/app/_components/DetailLabel";
import { SubField } from "~/app/_components/SubField";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { useConfigs, useUI } from "~/app/_contexts";
import type { IGraphicalTransaction, IGraphicalUtxo } from "~/app/_interfaces";
import { JSONBIG } from "~/app/_utils";
import { type Network } from "~/app/_utils/network-config";
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
  "Required Signers": "required_signers",
  "Voting Procedures": "voting_procedures",
  "Proposal Procedures": "proposal_procedures",
  "Auxiliary Scripts": "auxiliary_scripts",
};

export function DissectSection({
  tx,
  chain: chainProp,
}: {
  tx: IGraphicalTransaction;
  chain?: Network;
}) {
  const { loading } = useUI();
  const { configs } = useConfigs();
  const chain = chainProp ?? (configs.net as Network | undefined);
  const [activeKey, setActiveKey] = useState<string>("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );

  const toggleGroup = useCallback((group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);

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
      nativeScripts: [],
      bootstrapWitnesses: [],
    };
    const aux = tx.auxiliaryScripts ?? {
      nativeScripts: [],
      plutusV1Scripts: [],
    };

    const result: SidebarItem[] = [];

    normalInputs.forEach((utxo, i) => {
      result.push({
        group: "Inputs",
        key: `input-${i}`,
        label: `#${i}  ${utxo.txHash}#${utxo.index}`,
        content: <UtxoDetail utxo={utxo} chain={chain} />,
      });
    });
    tx.outputs.forEach((utxo, i) => {
      result.push({
        group: "Outputs",
        key: `output-${i}`,
        label: `#${i}  ${utxo.txHash}#${utxo.index}`,
        content: <UtxoDetail utxo={utxo} chain={chain} />,
      });
    });
    referenceInputs.forEach((utxo, i) => {
      result.push({
        group: "Ref Inputs",
        key: `ref-${i}`,
        label: `#${i}  ${utxo.txHash}#${utxo.index}`,
        content: <UtxoDetail utxo={utxo} chain={chain} />,
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
        content: <WithdrawalDetail w={w} chain={chain} />,
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
        content: <CollateralDetail col={col} chain={chain} />,
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
          label: `Redeemer ${r.tag} - Index: ${r.index}`,
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
      if (wit.plutusV1Scripts.length > 0)
        result.push({
          group: "Witnesses",
          key: "witness-plutus-v1",
          label: `Plutus V1 (${wit.plutusV1Scripts.length})`,
          content: <ScriptList items={wit.plutusV1Scripts} label="Plutus V1" />,
        });
      if (wit.plutusV2Scripts.length > 0)
        result.push({
          group: "Witnesses",
          key: "witness-plutus-v2",
          label: `Plutus V2 (${wit.plutusV2Scripts.length})`,
          content: <ScriptList items={wit.plutusV2Scripts} label="Plutus V2" />,
        });
      if (wit.plutusV3Scripts.length > 0)
        result.push({
          group: "Witnesses",
          key: "witness-plutus-v3",
          label: `Plutus V3 (${wit.plutusV3Scripts.length})`,
          content: <ScriptList items={wit.plutusV3Scripts} label="Plutus V3" />,
        });
      if ((wit.nativeScripts?.length ?? 0) > 0)
        result.push({
          group: "Witnesses",
          key: "witness-native-scripts",
          label: `Native Scripts (${wit.nativeScripts!.length})`,
          content: (
            <ScriptList items={wit.nativeScripts!} label="Native Script" />
          ),
        });
      if ((wit.bootstrapWitnesses?.length ?? 0) > 0)
        result.push({
          group: "Witnesses",
          key: "witness-bootstrap",
          label: `Bootstrap (${wit.bootstrapWitnesses!.length})`,
          content: <BootstrapDetail items={wit.bootstrapWitnesses!} />,
        });
    }

    if (aux.nativeScripts.length > 0)
      result.push({
        group: "Auxiliary Scripts",
        key: "aux-native-scripts",
        label: `Native (${aux.nativeScripts.length})`,
        content: <ScriptList items={aux.nativeScripts} label="Native Script" />,
      });
    if (aux.plutusV1Scripts.length > 0)
      result.push({
        group: "Auxiliary Scripts",
        key: "aux-plutus-v1",
        label: `Plutus V1 (${aux.plutusV1Scripts.length})`,
        content: <ScriptList items={aux.plutusV1Scripts} label="Plutus V1" />,
      });

    const signers = tx.requiredSigners ?? [];
    if (signers.length > 0) {
      result.push({
        group: "Required Signers",
        key: "required-signers",
        label: `Signers (${signers.length})`,
        content: <RequiredSignersDetail signers={signers} />,
      });
    }

    const voting = tx.votingProcedures ?? [];
    voting.forEach((vp, i) => {
      result.push({
        group: "Voting Procedures",
        key: `vote-${i}`,
        label: `#${i}  ${vp.voter.kind}`,
        content: <VotingProcedureDetail vp={vp} />,
      });
    });

    const proposals = tx.proposalProcedures ?? [];
    proposals.forEach((pp, i) => {
      result.push({
        group: "Proposal Procedures",
        key: `proposal-${i}`,
        label: `#${i}  ${pp.govAction.kind}`,
        content: <ProposalProcedureDetail pp={pp} chain={chain} />,
      });
    });

    if (tx.validityStart !== undefined || tx.ttl !== undefined) {
      result.push({
        group: "Validity Range",
        key: "validity-range",
        label: "Validity Range",
        content: (
          <ValidityRangeDetail validityStart={tx.validityStart} ttl={tx.ttl} />
        ),
      });
    }

    if (tx.treasuryValue !== undefined || tx.donation !== undefined) {
      result.push({
        group: "Treasury",
        key: "treasury",
        label: "Treasury",
        content: (
          <TreasuryDetail
            treasuryValue={tx.treasuryValue}
            donation={tx.donation}
          />
        ),
      });
    }

    return result;
  }, [tx, chain]);

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

  return (
    <div className="flex flex-col min-h-0 w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4 mb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-mono text-base font-bold text-accent-blue">
            {tx.era}
          </span>
          <span
            className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${tx.scriptsSuccessful ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
          >
            {tx.scriptsSuccessful ? "SCRIPTS OK" : "SCRIPTS FAIL"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-6 md:gap-y-2 md:ml-auto">
          <Stat label="Fee" value={formatAda(tx.fee)} suffix="₳" />
          <Stat label="Size" value={`${tx.size}`} suffix="B" />
          {tx.blockHeight !== undefined && (
            <Stat label="Block height" value={`${tx.blockHeight.toFixed(0)}`} />
          )}
          {tx.networkId !== undefined && (
            <Stat label="Network" value={`${tx.networkId}`} />
          )}
          {tx.scriptDataHash && (
            <div className="flex items-baseline gap-1.5 flex-shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-p-secondary">
                Script Data Hash
              </span>
              <div className="flex items-center gap-1">
                <Tooltip content={tx.scriptDataHash} delay={300} size="sm">
                  <span className="font-mono text-sm font-medium text-p-primary cursor-default">
                    {tx.scriptDataHash.slice(0, 10)}...
                    {tx.scriptDataHash.slice(-10)}
                  </span>
                </Tooltip>
                <CopyButton text={tx.scriptDataHash} size={12} />
              </div>
            </div>
          )}
          {tx.auxiliaryDataHash && (
            <div className="flex items-baseline gap-1.5 flex-shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-p-secondary">
                Aux Data Hash
              </span>
              <div className="flex items-center gap-1">
                <Tooltip content={tx.auxiliaryDataHash} delay={300} size="sm">
                  <span className="font-mono text-sm font-medium text-p-primary cursor-default">
                    {tx.auxiliaryDataHash.slice(0, 10)}...
                    {tx.auxiliaryDataHash.slice(-10)}
                  </span>
                </Tooltip>
                <CopyButton text={tx.auxiliaryDataHash} size={12} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Card className="shadow-none border border-border bg-surface flex-1 min-h-0">
        <CardBody className="flex flex-col gap-6 p-0 md:flex-row min-h-0">
          <div className="flex flex-col gap-3 border-r border-border min-w-[220px] max-w-[260px] overflow-y-auto p-4">
            {[...grouped.entries()].map(([group, groupItems]) => {
              const isCollapsed = collapsedGroups.has(group);
              return (
                <div key={group} className="flex flex-col gap-1">
                  <button
                    className="text-xs font-semibold uppercase tracking-wide text-p-secondary px-1 flex items-center gap-1 w-full text-left hover:text-p-primary transition-colors cursor-pointer"
                    onClick={() => toggleGroup(group)}
                  >
                    <span className="inline-block w-3 flex-shrink-0 text-center leading-none">
                      {isCollapsed ? "▸" : "▾"}
                    </span>
                    {group} ({groupItems.length})
                  </button>
                  {!isCollapsed &&
                    groupItems.map((item) => {
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
              );
            })}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4 pt-4">
            {activeItem && GROUP_TOPIC_KEY[activeItem.group] && (
              <p className="mb-4 text-xs text-p-secondary leading-relaxed border-b border-border pb-3">
                {TOPICS[GROUP_TOPIC_KEY[activeItem.group]!]}
              </p>
            )}
            {activeItem?.content ?? (
              <div className="py-20 text-center">
                <p className="text-lg font-semibold text-p-secondary">0</p>
                <p className="mt-2 text-sm text-p-secondary">
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

function UtxoDetail({
  utxo,
  chain,
}: {
  utxo: IGraphicalUtxo;
  chain?: Network;
}) {
  return (
    <div className="space-y-4">
      <div>
        <DetailLabel>Transaction Output Reference</DetailLabel>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold break-all text-p-primary">
            {utxo.txHash}#{utxo.index}
          </span>
          <CopyButton text={`${utxo.txHash}#${utxo.index}`} size={14} />
        </div>
      </div>

      {utxo.address && (
        <div>
          <DetailLabel>Address</DetailLabel>
          <div className="flex items-center gap-2 mb-2">
            <ColoredAddress
              address={Address(utxo.address.bech32)}
              chain={chain}
              full
            />
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
        <span className="font-mono text-sm font-medium tabular-nums">
          {utxo.lovelace}
        </span>
      </div>

      {utxo.datum && (
        <div>
          <DetailLabel>Datum</DetailLabel>
          <div className="font-mono text-sm break-all text-p-primary">
            {utxo.datum.hash}
          </div>
          {utxo.datum.bytes && (
            <CodeBlock size="xs" maxHeight="60" className="mt-2">
              {utxo.datum.bytes}
            </CodeBlock>
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
                    {a.assetNameAscii ? (
                      <Tooltip content={a.assetNameAscii} delay={300} size="sm">
                        <span className="text-p-secondary flex-shrink-0 max-w-[160px] truncate cursor-default">
                          {a.assetNameAscii}
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-p-secondary flex-shrink-0 max-w-[160px] truncate">
                        —
                      </span>
                    )}
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
      <CodeBlock>
        {JSON.stringify(cert, null, 2)}
      </CodeBlock>
    </div>
  );
}

function WithdrawalDetail({
  w,
  chain,
}: {
  w: WithdrawalType;
  chain?: Network;
}) {
  return (
    <div className="space-y-4">
      <div>
        <DetailLabel>Address</DetailLabel>
        <ColoredAddress address={Address(w.rewardAccount)} chain={chain} full />
        <div className="font-mono text-sm break-all">{w.rewardAccount}</div>
      </div>
      <div>
        <DetailLabel>Amount</DetailLabel>
        <span className="font-mono text-sm font-medium tabular-nums">
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
              {a.assetNameAscii ? (
                <Tooltip content={a.assetNameAscii} delay={300} size="sm">
                  <span className="cursor-default">{a.assetNameAscii}</span>
                </Tooltip>
              ) : (
                "—"
              )}
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
      <CodeBlock>
        {JSONBIG.stringify(m.jsonMetadata, null, 2)}
      </CodeBlock>
    </div>
  );
}

function CollateralDetail({
  col,
  chain,
}: {
  col: CollateralType;
  chain?: Network;
}) {
  return (
    <div className="space-y-4">
      {col.total !== undefined && (
        <div>
          <DetailLabel>Total</DetailLabel>
          <span className="font-mono text-base font-semibold tabular-nums">
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
                <div>
                  <DetailLabel>Address</DetailLabel>
                  <ColoredAddress
                    address={Address(ref.address)}
                    chain={chain}
                    full
                  />
                </div>

                <div>
                  <DetailLabel>Lovelace</DetailLabel>
                  <span className="font-mono text-sm font-medium tabular-nums">
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
                      <CodeBlock size="xs" maxHeight="60" className="mt-2">
                        {ref.datum.bytes}
                      </CodeBlock>
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
              <DetailLabel className="w-16 flex-shrink-0">Key</DetailLabel>
              <span className="font-mono text-sm break-all">{w.key}</span>
            </div>
            <div className="flex items-start gap-4 px-4 py-3">
              <DetailLabel className="w-16 flex-shrink-0">Hash</DetailLabel>
              <span className="font-mono text-sm break-all">{w.hash}</span>
            </div>
            <div className="flex items-start gap-4 px-4 py-3">
              <DetailLabel className="w-16 flex-shrink-0">Sig</DetailLabel>
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
        <CodeBlock>
          {JSONBIG.stringify(JSON.parse(r.dataJson), null, 2)}
        </CodeBlock>
      </div>
    </div>
  );
}

function ScriptList({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      {items.map((script, i) => (
        <div
          key={i}
          className="border border-border bg-surface rounded overflow-hidden"
        >
          <div className="px-4 py-2 bg-explorer-row border-b border-border flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-p-primary">
              {label} #{i}
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-2">
              <span className="font-mono text-xs break-all flex-1 min-w-0 leading-relaxed">
                {script}
              </span>
              <CopyButton text={script} size={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BootstrapDetail({ items }: { items: Bootstrap[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      {items.map((bw, i) => (
        <div
          key={i}
          className="border border-border bg-surface rounded overflow-hidden"
        >
          <div className="px-4 py-2 bg-explorer-row border-b border-border flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-p-primary">
              Bootstrap #{i}
            </span>
          </div>
          <div className="divide-y divide-border/50">
            <HexRow label="Public Key" value={bw.publicKey} />
            <HexRow label="Signature" value={bw.signature} />
            <HexRow label="Chain Code" value={bw.chainCode} />
            <HexRow label="Attributes" value={bw.attributes} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HexRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-p-secondary w-24 flex-shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="font-mono text-sm break-all">{value}</span>
        <CopyButton text={value} size={12} />
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
          <CodeBlock maxHeight="60">
            {d.bytes}
          </CodeBlock>
        </div>
      )}
      {d.json && (
        <div>
          <DetailLabel>JSON</DetailLabel>
          <CodeBlock>
            {d.json}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}

function RequiredSignersDetail({ signers }: { signers: string[] }) {
  return (
    <div className="space-y-2">
      {signers.map((hash, i) => (
        <div
          key={i}
          className="flex items-center gap-2 font-mono text-sm break-all border border-border bg-explorer-row/30 px-3 py-2 rounded"
        >
          <span className="flex-1 min-w-0">{hash}</span>
          <CopyButton text={hash} size={12} />
        </div>
      ))}
    </div>
  );
}

function VotingProcedureDetail({ vp }: { vp: VotingProcedureEntry }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold">{vp.voter.kind}</span>
        <span
          className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
            vp.vote === "Yes"
              ? "bg-green-500/10 text-green-600"
              : vp.vote === "No"
                ? "bg-red-500/10 text-red-600"
                : "bg-yellow-500/10 text-yellow-600"
          }`}
        >
          {vp.vote}
        </span>
      </div>

      <div>
        <DetailLabel>Voter Hash</DetailLabel>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm break-all">{vp.voter.hash}</span>
          <CopyButton text={vp.voter.hash} size={12} />
        </div>
      </div>

      <div>
        <DetailLabel>Gov Action</DetailLabel>
        <span className="font-mono text-sm">
          {vp.govActionId.transactionId}#{vp.govActionId.actionIndex}
        </span>
      </div>

      {vp.anchor && (
        <div className="space-y-2 border border-border bg-explorer-row/30 rounded p-3">
          <DetailLabel>Anchor</DetailLabel>
          <div>
            <p className="text-xs text-p-secondary">URL</p>
            <p className="font-mono text-sm break-all">{vp.anchor.url}</p>
          </div>
          <div>
            <p className="text-xs text-p-secondary">Hash</p>
            <p className="font-mono text-sm break-all">{vp.anchor.hash}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalProcedureDetail({
  pp,
  chain,
}: {
  pp: ProposalProcedure;
  chain?: Network;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold">{pp.govAction.kind}</span>
      </div>

      <div>
        <DetailLabel>Deposit</DetailLabel>
        <span className="font-mono text-sm font-medium tabular-nums">
          {formatAda(pp.deposit)}
          <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
        </span>
      </div>

      <div>
        <DetailLabel>Reward Account</DetailLabel>
        <ColoredAddress
          address={Address(pp.rewardAccount)}
          chain={chain}
          full
        />
        <div className="font-mono text-sm break-all mt-1">
          {pp.rewardAccount}
        </div>
      </div>

      <div>
        <DetailLabel>Gov Action Details</DetailLabel>
        <CodeBlock className="mt-1">
          {JSONBIG.stringify(pp.govAction, null, 2)}
        </CodeBlock>
      </div>

      <div className="space-y-2 border border-border bg-explorer-row/30 rounded p-3">
        <DetailLabel>Anchor</DetailLabel>
        <div>
          <p className="text-xs text-p-secondary">URL</p>
          <p className="font-mono text-sm break-all">{pp.anchor.url}</p>
        </div>
        <div>
          <p className="text-xs text-p-secondary">Hash</p>
          <p className="font-mono text-sm break-all">{pp.anchor.hash}</p>
        </div>
      </div>
    </div>
  );
}

function ValidityRangeDetail({
  validityStart,
  ttl,
}: {
  validityStart?: number;
  ttl?: number;
}) {
  return (
    <div className="space-y-3">
      {validityStart !== undefined && (
        <SubField
          label="Validity Start (Invalid Before)"
          value={`${validityStart}`}
          mono
        />
      )}
      {ttl !== undefined && (
        <SubField label="TTL (Invalid Hereafter)" value={`${ttl}`} mono />
      )}
    </div>
  );
}

function TreasuryDetail({
  treasuryValue,
  donation,
}: {
  treasuryValue?: number;
  donation?: number;
}) {
  return (
    <div className="space-y-4">
      {treasuryValue !== undefined && (
        <div>
          <DetailLabel>Treasury Value</DetailLabel>
          <span className="font-mono text-sm font-medium tabular-nums">
            {formatAda(treasuryValue)}
            <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
          </span>
        </div>
      )}
      {donation !== undefined && (
        <div>
          <DetailLabel>Donation</DetailLabel>
          <span className="font-mono text-sm font-medium tabular-nums">
            {formatAda(donation)}
            <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
          </span>
        </div>
      )}
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
      <span className="text-xs font-semibold uppercase tracking-wide text-p-secondary">
        {label}
      </span>
      <span className="font-mono text-sm font-medium text-p-primary tabular-nums">
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
