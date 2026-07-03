import type {
  Certificate,
  Metadata,
  RewardWithdrawal as WithdrawalType,
} from "@laceanatomy/napi-pallas";
import { useCallback, useMemo, useState } from "react";
import type { IGraphicalTransaction } from "~/app/_interfaces";
import { type Network } from "~/app/_utils/network-config";
import {
  ProposalProcedureDetail,
  VotingProcedureDetail,
} from "./GovernanceDetails";
import type TOPICS from "./topics";
import {
  CertDetail,
  CollateralDetail,
  MetadataDetail,
  MintDetail,
  RequiredSignersDetail,
  TreasuryDetail,
  ValidityRangeDetail,
  WithdrawalDetail,
} from "./TransactionDetails";
import { formatAda } from "./utils";
import { UtxoDetail } from "./UtxoDetail";
import {
  BootstrapDetail,
  PlutusDetail,
  RedeemerDetail,
  ScriptList,
  VKeyDetail,
} from "./WitnessDetails";

export type SidebarItem = {
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

export { GROUP_TOPIC_KEY };

export function useDissectSidebar(tx: IGraphicalTransaction, chain?: Network) {
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

  const grouped = useMemo(() => {
    const map = new Map<string, SidebarItem[]>();
    for (const item of items) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return map;
  }, [items]);

  const activeItem = useMemo(() => {
    return items.find((i) => i.key === activeKey) ?? items[0];
  }, [items, activeKey]);

  return {
    items,
    grouped,
    activeKey,
    setActiveKey,
    collapsedGroups,
    toggleGroup,
    activeItem,
  };
}
