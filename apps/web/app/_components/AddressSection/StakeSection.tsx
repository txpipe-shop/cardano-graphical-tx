import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";

function DetailLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-wide text-p-secondary mb-1.5 ${className ?? ""}`}
    >
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

export function StakeSection({ data }: { data: AddressDiagnostic }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-p-secondary leading-relaxed">
        Your address is a valid bech32 address value. By decoding the content we
        obtain a bytestring that can be interpreted according to&nbsp;
        <a
          className="text-accent-blue underline hover:text-accent-blue"
          href="https://cips.cardano.org/cip/CIP-0019"
          target="_blank"
          rel="noopener noreferrer"
        >
          CIP-0019
        </a>
        . There are 3 types of possible address, each following a different
        encoding format: Shelley, Stake, or Byron.
      </p>

      {data?.bytes && (
        <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded">
          <DetailLabel>Address Bytes (Hex)</DetailLabel>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-p-primary break-all flex-1 min-w-0">
              {data.bytes}
            </span>
            <CopyButton text={data.bytes} size={14} />
          </div>
        </div>
      )}

      <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-3">
        <DetailLabel>Parsed Address</DetailLabel>
        <SubField label="Type" value={data?.kind} />

        <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-2">
          <DetailLabel>Network Tag</DetailLabel>
          <p className="text-xs text-p-secondary leading-relaxed">
            The network tag is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </p>
          <SubField label="Network Tag" value={data?.network} />
        </div>

        {(!!data?.delegationPart?.hash || !!data?.delegationPart?.pointer) && (
          <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-2">
            <DetailLabel>Delegation Info</DetailLabel>
            <p className="text-xs text-p-secondary leading-relaxed">
              The delegation part describes who has control of the staking of
              the locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <SubField
              label="Kind"
              value={
                data.delegationPart!.isScript ? "script" : "verification key"
              }
            />
            {data.delegationPart!.hash && (
              <div>
                <DetailLabel>Hash</DetailLabel>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-p-primary break-all flex-1 min-w-0">
                    {data.delegationPart!.hash}
                  </span>
                  <CopyButton text={data.delegationPart!.hash} size={14} />
                </div>
              </div>
            )}
            {data.delegationPart!.pointer && (
              <SubField
                label="Pointer"
                value={data.delegationPart!.pointer}
                mono
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
