import { PropBlock, Section } from "~/app/_components";
import type { AddressDiagnostic } from "~/napi-pallas";

export function ByronSection({ data }: { data: AddressDiagnostic }) {
  return (
    <Section title="Decoded Base58">
      <p className="text-xl text-gray-600">
        Your address is a valid base58 address value. By decoding the base58
        content we obtain a bytestring that can be interpreted according
        to&nbsp;
        <a
          className="text-blue-700 underline hover:text-blue-500"
          href="https://cips.cardano.org/cip/CIP-0019"
          target="_blank"
          rel="noopener noreferrer"
        >
          CIP-0019
        </a>
        . The CIP explains that there are 3 types of possible address, each one
        following a different encoding format: Shelley, Stake, or Byron.
      </p>
      <PropBlock
        title="address bytes (hex)"
        value={data?.bytes}
        color="green"
      />
      <Section title="Parsed Address">
        <p className="text-xl text-gray-600">
          The address entered is of type&nbsp;
          <code>Byron</code>. Byron addresses are actually CBOR structures with
          several pieces of information. Since Byron addresses are deprecated
          and kept only for backward compatibility, we won&apos;t go into much
          more detail.
        </p>
        <PropBlock title="type" value={data?.kind} />
        <Section title="CBOR">
          <p className="text-xl text-gray-600">
            The following bytes are CBOR-encoded structures. You can continue
            your decoding journey using these (hex-encoded) bytes and a CBOR
            decoder.
          </p>
          <PropBlock title="CBOR (hex)" value={data?.byronCbor} color="green" />
        </Section>
      </Section>
    </Section>
  );
}
