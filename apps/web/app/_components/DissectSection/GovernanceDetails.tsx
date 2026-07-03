import type {
  ProposalProcedure,
  VotingProcedureEntry,
} from "@laceanatomy/napi-pallas";
import { Address } from "@laceanatomy/types";
import { CodeBlock } from "~/app/_components/CodeBlock";
import { DetailLabel } from "~/app/_components/DetailLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { FieldBlock } from "~/app/_components/FieldBlock";
import { MonoText } from "~/app/_components/MonoText";
import { SubLabel } from "~/app/_components/SubLabel";
import { JSONBIG } from "~/app/_utils";
import { type Network } from "~/app/_utils/network-config";
import ColoredAddress from "../ExplorerSection/ColoredAddress";
import { formatAda } from "./utils";

export function VotingProcedureDetail({ vp }: { vp: VotingProcedureEntry }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MonoText className="font-bold">{vp.voter.kind}</MonoText>
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
          <MonoText>{vp.voter.hash}</MonoText>
          <CopyButton text={vp.voter.hash} size={12} />
        </div>
      </div>

      <div>
        <DetailLabel>Gov Action</DetailLabel>
        <MonoText>
          {vp.govActionId.transactionId}#{vp.govActionId.actionIndex}
        </MonoText>
      </div>

      {vp.anchor && (
        <FieldBlock className="space-y-2">
          <DetailLabel>Anchor</DetailLabel>
          <div>
            <SubLabel>URL</SubLabel>
            <MonoText>{vp.anchor.url}</MonoText>
          </div>
          <div>
            <SubLabel>Hash</SubLabel>
            <MonoText>{vp.anchor.hash}</MonoText>
          </div>
        </FieldBlock>
      )}
    </div>
  );
}

export function ProposalProcedureDetail({
  pp,
  chain,
}: {
  pp: ProposalProcedure;
  chain?: Network;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MonoText className="font-bold">{pp.govAction.kind}</MonoText>
      </div>

      <div>
        <DetailLabel>Deposit</DetailLabel>
        <MonoText className="font-medium tabular-nums">
          {formatAda(pp.deposit)}
          <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
        </MonoText>
      </div>

      <div>
        <DetailLabel>Reward Account</DetailLabel>
        <ColoredAddress
          address={Address(pp.rewardAccount)}
          chain={chain}
          full
        />
        <MonoText className="mt-1">{pp.rewardAccount}</MonoText>
      </div>

      <div>
        <DetailLabel>Gov Action Details</DetailLabel>
        <CodeBlock className="mt-1">
          {JSONBIG.stringify(pp.govAction, null, 2)}
        </CodeBlock>
      </div>

      <FieldBlock className="space-y-2">
        <DetailLabel>Anchor</DetailLabel>
        <div>
          <SubLabel>URL</SubLabel>
          <MonoText>{pp.anchor.url}</MonoText>
        </div>
        <div>
          <SubLabel>Hash</SubLabel>
          <MonoText>{pp.anchor.hash}</MonoText>
        </div>
      </FieldBlock>
    </div>
  );
}
