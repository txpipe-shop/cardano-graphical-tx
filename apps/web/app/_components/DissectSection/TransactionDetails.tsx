import type {
  Assets,
  Certificate,
  Collateral as CollateralType,
  Metadata,
  RewardWithdrawal as WithdrawalType,
} from "@laceanatomy/napi-pallas";
import { Address } from "@laceanatomy/types";
import { type Network } from "@laceanatomy/types/cardano";
import { CodeBlock } from "~/app/_components/CodeBlock";
import { DetailLabel } from "~/app/_components/DetailLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { FieldBlock } from "~/app/_components/FieldBlock";
import { MonoText } from "~/app/_components/MonoText";
import { SubField } from "~/app/_components/SubField";
import { JSONBIG } from "~/app/_utils";
import ColoredAddress from "../ExplorerSection/ColoredAddress";
import { formatAda } from "./utils";

export function CertDetail({ cert }: { cert: Certificate }) {
  return (
    <div className="space-y-3">
      <DetailLabel>{cert.kind}</DetailLabel>
      <CodeBlock>{JSON.stringify(cert, null, 2)}</CodeBlock>
    </div>
  );
}

export function WithdrawalDetail({
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
        <MonoText>{w.rewardAccount}</MonoText>
      </div>
      <div>
        <DetailLabel>Amount</DetailLabel>
        <MonoText className="font-medium tabular-nums">
          {formatAda(w.amount)}
          <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
        </MonoText>
      </div>
    </div>
  );
}

export function MintDetail({
  mint,
  isMint,
}: {
  mint: Assets;
  isMint: boolean;
}) {
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
      <MonoText>{mint.policyId}</MonoText>
      <DetailLabel>Assets</DetailLabel>
      <div className="space-y-px border border-border/50 rounded">
        {mint.assetsPolicy.map((a, j) => (
          <div
            key={j}
            className="flex items-center gap-3 px-3 py-2 bg-explorer-row/30 text-sm"
          >
            <MonoText className="flex-1 min-w-0 truncate">
              {a.assetName}
            </MonoText>
            <span className="text-p-secondary flex-shrink-0 max-w-[160px] truncate">
              {a.assetNameAscii ? (
                <span className="cursor-default">{a.assetNameAscii}</span>
              ) : (
                "—"
              )}
            </span>
            <MonoText className="font-bold flex-shrink-0 w-24 text-right">
              {a.amount?.toFixed(0) ?? 0}
            </MonoText>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetadataDetail({ m }: { m: Metadata }) {
  return (
    <div className="space-y-3">
      <DetailLabel>Label: {m.label}</DetailLabel>
      <CodeBlock>{JSONBIG.stringify(m.jsonMetadata, null, 2)}</CodeBlock>
    </div>
  );
}

export function CollateralDetail({
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
          <MonoText className="text-base font-semibold tabular-nums">
            {col.total}
          </MonoText>
        </div>
      )}

      {col.inputs && col.inputs.length > 0 && (
        <div>
          <DetailLabel>Collateral Inputs</DetailLabel>
          <div className="space-y-1 mt-1">
            {col.inputs.map((inp, i) => (
              <FieldBlock key={i} className="flex items-center gap-2">
                <MonoText>
                  {inp.txHash}#{inp.index}
                </MonoText>
                <CopyButton text={`${inp.txHash}#${inp.index}`} size={12} />
              </FieldBlock>
            ))}
          </div>
        </div>
      )}

      {col.collateralReturn && col.collateralReturn.length > 0 && (
        <div>
          <DetailLabel>Collateral Return</DetailLabel>
          <div className="space-y-3 mt-1">
            {col.collateralReturn.map((ref, i) => (
              <FieldBlock key={i} className="space-y-3">
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
                  <MonoText className="font-medium tabular-nums">
                    {ref.lovelace}
                  </MonoText>
                </div>

                {ref.datum && (
                  <div>
                    <DetailLabel>Datum</DetailLabel>
                    <MonoText className="text-p-primary">
                      {ref.datum.hash}
                    </MonoText>
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
                    <MonoText>{ref.scriptRef}</MonoText>
                  </div>
                )}
              </FieldBlock>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RequiredSignersDetail({ signers }: { signers: string[] }) {
  return (
    <div className="space-y-2">
      {signers.map((hash, i) => (
        <FieldBlock key={i} className="flex items-center gap-2">
          <MonoText className="flex-1 min-w-0">{hash}</MonoText>
          <CopyButton text={hash} size={12} />
        </FieldBlock>
      ))}
    </div>
  );
}

export function ValidityRangeDetail({
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

export function TreasuryDetail({
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
          <MonoText className="font-medium tabular-nums">
            {formatAda(treasuryValue)}
            <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
          </MonoText>
        </div>
      )}
      {donation !== undefined && (
        <div>
          <DetailLabel>Donation</DetailLabel>
          <MonoText className="font-medium tabular-nums">
            {formatAda(donation)}
            <span className="ml-1 text-sm font-medium text-p-secondary">₳</span>
          </MonoText>
        </div>
      )}
    </div>
  );
}

export function Stat({
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
      <DetailLabel>{label}</DetailLabel>
      <MonoText className="font-medium text-p-primary tabular-nums">
        {value}
        {suffix && (
          <span className="ml-0.5 text-xs font-medium text-p-secondary">
            {suffix}
          </span>
        )}
      </MonoText>
    </div>
  );
}
