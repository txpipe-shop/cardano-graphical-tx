import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { DetailLabel } from "~/app/_components/DetailLabel";
import { FieldBlock } from "~/app/_components/FieldBlock";
import { MonoText } from "~/app/_components/MonoText";
import { SubField } from "~/app/_components/SubField";
import { SubLabel } from "~/app/_components/SubLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";

export function StakeSection({ data }: { data: AddressDiagnostic }) {
  return (
    <div className="space-y-4">
      <SubLabel className="leading-relaxed">
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
      </SubLabel>

      {data?.bytes && (
        <FieldBlock>
          <DetailLabel>Address Bytes (Hex)</DetailLabel>
          <div className="flex items-center gap-2">
            <MonoText className="text-p-primary flex-1 min-w-0">
              {data.bytes}
            </MonoText>
            <CopyButton text={data.bytes} size={14} />
          </div>
        </FieldBlock>
      )}

      <FieldBlock className="space-y-3">
        <DetailLabel>Parsed Address</DetailLabel>
        <SubField label="Type" value={data?.kind} />

        <FieldBlock className="space-y-2">
          <DetailLabel>Network Tag</DetailLabel>
          <SubLabel className="leading-relaxed">
            The network tag is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </SubLabel>
          <SubField label="Network Tag" value={data?.network} />
        </FieldBlock>

        {(!!data?.delegationPart?.hash || !!data?.delegationPart?.pointer) && (
          <FieldBlock className="space-y-2">
            <DetailLabel>Delegation Info</DetailLabel>
            <SubLabel className="leading-relaxed">
              The delegation part describes who has control of the staking of
              the locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </SubLabel>
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
                  <MonoText className="text-p-primary flex-1 min-w-0">
                    {data.delegationPart!.hash}
                  </MonoText>
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
          </FieldBlock>
        )}
      </FieldBlock>
    </div>
  );
}
