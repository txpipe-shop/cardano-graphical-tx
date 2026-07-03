import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { HashDisplay } from "~/app/_components/HashDisplay";

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

export function ShelleySection({ data }: { data: AddressDiagnostic }) {
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
          <HashDisplay hash={data.bytes} length={24} />
        </div>
      )}

      <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-3">
        <DetailLabel>Parsed Address</DetailLabel>
        <SubField label="Type" value={data?.kind} />

        <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-2">
          <DetailLabel>Network Id</DetailLabel>
          <p className="text-xs text-p-secondary leading-relaxed">
            The network id is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </p>
          <SubField label="Network Id" value={data?.network} />
        </div>

        {!!data.paymentPart && (
          <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-2">
            <DetailLabel>Payment Part</DetailLabel>
            <p className="text-xs text-p-secondary leading-relaxed">
              The payment part describes who has control of the ownership of the
              locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <SubField
              label="Kind"
              value={data.paymentPart.isScript ? "script" : "verification key"}
            />
            {data.paymentPart.hash && (
              <div>
                <DetailLabel>Hash</DetailLabel>
                <HashDisplay hash={data.paymentPart.hash} length={16} />
              </div>
            )}
          </div>
        )}

        {(!!data.delegationPart?.hash || !!data.delegationPart?.pointer) && (
          <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-2">
            <DetailLabel>Delegation Part</DetailLabel>
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
                <HashDisplay hash={data.delegationPart!.hash} length={16} />
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

        {!data.delegationPart?.hash && !data.delegationPart?.pointer && (
          <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-2">
            <DetailLabel>Delegation Part</DetailLabel>
            <p className="text-xs text-p-secondary leading-relaxed">
              The delegation part describes who has control of the staking of
              the locked values. This address doesn&apos;t specify a delegation
              part, which means there&apos;s no way to delegate the locked
              values of this address.
            </p>
            <p className="text-xs text-p-secondary italic">Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
