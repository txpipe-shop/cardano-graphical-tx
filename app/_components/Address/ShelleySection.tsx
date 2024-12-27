import { EmptyBlock, PropBlock, Section } from "../DissectedTx/Constructors";

function ShelleySection(props: { data: any }) {
  const { data } = props;

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
          <code>Shelley</code>. Shelley addresses contain three pieces of
          information: network id, payment part and a delegation part.
        </p>
        <PropBlock title="type" value={data?.address.kind} />
        <Section title="Network Id">
          <p className="text-xl text-gray-600">
            The netword id is a flag to indicate to which network it belongs
            (either mainnet or a testnet).
          </p>
          <PropBlock title="network id" value={data?.address.network} />
        </Section>
        {!!data.address.paymentPart && (
          <Section title="Payment Part">
            <p className="text-xl text-gray-600">
              The payment part describes who has control of the ownership of the
              locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <PropBlock
              title="kind"
              value={
                data.address.paymentPart.isScript
                  ? "script"
                  : "verification key"
              }
            />
            <PropBlock
              color="green"
              title="hash"
              value={data.address.paymentPart.hash}
            />
          </Section>
        )}
        {(!!data.address.delegationPart.hash ||
          !!data.address.delegationPart.pointer) && (
          <Section title="Delegation Part">
            <p className="text-xl text-gray-600">
              The delegation part describes who has control of the staking of
              the locked values. There are two options: a verification key or a
              script. The address includes a flag to differentiate the two.
            </p>
            <PropBlock
              title="kind"
              value={
                data.address.delegationPart.isScript
                  ? "script"
                  : "verification key"
              }
            />
            {data.address.delegationPart.hash && (
              <PropBlock
                color="green"
                title="hash"
                value={data.address.delegationPart.hash}
              />
            )}
            {data.address.delegationPart.pointer && (
              <PropBlock
                color="green"
                title="pointer"
                value={data.address.delegationPart.pointer}
              />
            )}
          </Section>
        )}
        {!data.address.delegationPart.hash &&
          !data.address.delegationPart.pointer && (
            <Section title="Delegation Part">
              <p className="text-xl text-gray-600">
                The delegation part describes who has control of the staking of
                the locked values. This address doesn't specify a delegation
                part, this means there's no way to delegate the locked values of
                this address.
              </p>
              <EmptyBlock />
            </Section>
          )}
      </Section>
    </Section>
  );
}
