import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { DetailLabel } from "~/app/_components/DetailLabel";
import { FieldBlock } from "~/app/_components/FieldBlock";
import { HashCopy } from "~/app/_components/HashCopy";
import { SubField } from "~/app/_components/SubField";
import { SubLabel } from "~/app/_components/SubLabel";

export function ShelleySection({ data }: { data: AddressDiagnostic }) {
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
          <HashCopy hash={data.bytes} length={24} />
        </FieldBlock>
      )}

      <FieldBlock className="space-y-3">
        <DetailLabel>Parsed Address</DetailLabel>
        <SubField label="Type" value={data?.kind} />

        <FieldBlock className="space-y-2">
          <DetailLabel>Network Id</DetailLabel>
          <SubLabel className="leading-relaxed">
            The network id is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </SubLabel>
          <SubField label="Network Id" value={data?.network} />
        </FieldBlock>

        {!!data.paymentPart && (
          <FieldBlock className="space-y-2">
            <DetailLabel>Payment Part</DetailLabel>
            <SubLabel className="leading-relaxed">
              The payment part describes who has control of the ownership of the
              locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </SubLabel>
            <SubField
              label="Kind"
              value={data.paymentPart.isScript ? "script" : "verification key"}
            />
            {data.paymentPart.hash && (
              <div>
                <DetailLabel>Hash</DetailLabel>
                <HashCopy hash={data.paymentPart.hash} length={16} />
              </div>
            )}
          </FieldBlock>
        )}

        {(!!data.delegationPart?.hash || !!data.delegationPart?.pointer) && (
          <FieldBlock className="space-y-2">
            <DetailLabel>Delegation Part</DetailLabel>
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
                <HashCopy hash={data.delegationPart!.hash} length={16} />
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

        {!data.delegationPart?.hash && !data.delegationPart?.pointer && (
          <FieldBlock className="space-y-2">
            <DetailLabel>Delegation Part</DetailLabel>
            <SubLabel className="leading-relaxed">
              The delegation part describes who has control of the staking of
              the locked values. This address doesn&apos;t specify a delegation
              part, which means there&apos;s no way to delegate the locked
              values of this address.
            </SubLabel>
            <SubLabel className="italic">Empty</SubLabel>
          </FieldBlock>
        )}
      </FieldBlock>
    </div>
  );
}
