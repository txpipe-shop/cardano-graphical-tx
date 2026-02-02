import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { PropBlock, Section } from "~/app/_components";
import { ValidAddr } from "./ValidAddr";

export function ByronSection({ data }: { data: AddressDiagnostic }) {
  return (
    <Section title="Decoded Base58">
      <ValidAddr />
      <PropBlock
        title="address bytes (hex)"
        value={data?.bytes}
        color="green"
      />
      <Section title="Parsed Address">
        <p className="text-xl text-p-secondary">
          The address entered is of type&nbsp;
          <code>Byron</code>. Byron addresses are actually CBOR structures with
          several pieces of information. Since Byron addresses are deprecated
          and kept only for backward compatibility, we won&apos;t go into much
          more detail.
        </p>
        <PropBlock title="type" value={data?.kind} />
        <Section title="CBOR">
          <p className="text-xl text-p-secondary">
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
