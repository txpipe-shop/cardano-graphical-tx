import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { PropBlock, Section } from "~/app/_components";

export function StakeSection({ data }: { data: AddressDiagnostic }) {
  return (
    <Section title="Decoded Bech32">
      <p className="text-xl text-gray-600">
        Your address is a valid bech32 address value. By decoding the bech32
        content we obtain a bytestring that can be interpreted according
        to&nbsp;
        <a
          className="text-blue-700 underline hover:text-blue-500"
          href="https://cips.cardano.org/cip/CIP-0019"
          target="_blank"
        >
          CIP-0019
        </a>
        . The CIP explains that there are 3 types of possible address, each one
        following a different encoding format: Shelley, Stake or Byron.
      </p>
      <PropBlock
        color="green"
        title="address bytes (hex)"
        value={data?.bytes}
      />
      <Section title="Parsed Address">
        <p className="text-xl text-gray-600">
          The address entered is of type&nbsp;
          <code>Stake</code>. Stake addresses contain two pieces of information:
          network tag and delegation info.
        </p>
        <PropBlock title="type" value={data?.kind} />
        <Section title="Network Tag">
          <p className="text-xl text-gray-600">
            The netword tag is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </p>
          <PropBlock title="network tag" value={data?.network} />
        </Section>
        {(!!data?.delegationPart?.hash || !!data?.delegationPart?.pointer) && (
          <Section title="Delegation Info">
            <p className="text-xl text-gray-600">
              The delegation part describes who has control of the staking of
              the locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <PropBlock
              title="kind"
              value={
                data.delegationPart.isScript ? "script" : "verification key"
              }
            />
            {data.delegationPart.hash && (
              <PropBlock
                color="green"
                title="hash"
                value={data.delegationPart.hash}
              />
            )}
            {data.delegationPart.pointer && (
              <PropBlock
                color="green"
                title="pointer"
                value={data.delegationPart.pointer}
              />
            )}
          </Section>
        )}
      </Section>
    </Section>
  );
}
