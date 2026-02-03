import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { EmptyBlock, PropBlock, Section } from "~/app/_components";
import { ValidAddr } from "./ValidAddr";

export function ShelleySection({ data }: { data: AddressDiagnostic }) {
  return (
    <Section title="Decoded Bech32">
      <ValidAddr />
      <PropBlock
        color="green"
        title="address bytes (hex)"
        value={data?.bytes}
      />
      <Section title="Parsed Address">
        <p className="text-xl text-p-secondary">
          The address entered is of type&nbsp;
          <code>Shelley</code>. Shelley addresses contain three pieces of
          information: network id, payment part, and a delegation part.
        </p>
        <PropBlock title="type" value={data?.kind} />
        <Section title="Network Id">
          <p className="text-xl text-p-secondary">
            The network id is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </p>
          <PropBlock title="network id" value={data?.network} />
        </Section>
        {!!data.paymentPart && (
          <Section title="Payment Part">
            <p className="text-xl text-p-secondary">
              The payment part describes who has control of the ownership of the
              locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <PropBlock
              title="kind"
              value={data.paymentPart.isScript ? "script" : "verification key"}
            />
            <PropBlock
              color="green"
              title="hash"
              value={data.paymentPart.hash}
            />
          </Section>
        )}
        {(!!data.delegationPart?.hash || !!data.delegationPart?.pointer) && (
          <Section title="Delegation Part">
            <p className="text-xl text-p-secondary">
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
        {!data.delegationPart?.hash && !data.delegationPart?.pointer && (
          <Section title="Delegation Part">
            <p className="text-xl text-p-secondary">
              The delegation part describes who has control of the staking of
              the locked values. This address doesn&apos;t specify a delegation
              part, which means there&apos;s no way to delegate the locked
              values of this address.
            </p>
            <EmptyBlock />
          </Section>
        )}
      </Section>
    </Section>
  );
}
