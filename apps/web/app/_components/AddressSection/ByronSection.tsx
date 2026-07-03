import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { CodeBlock } from "~/app/_components/CodeBlock";
import { DetailLabel } from "~/app/_components/DetailLabel";
import { FieldBlock } from "~/app/_components/FieldBlock";
import { MonoText } from "~/app/_components/MonoText";
import { SubLabel } from "~/app/_components/SubLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";

export function ByronSection({ data }: { data: AddressDiagnostic }) {
  return (
    <div className="space-y-4">
      <SubLabel className="leading-relaxed">
        Your address is a valid base58 address value. By decoding the base58
        content we obtain a bytestring that can be interpreted according
        to&nbsp;
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
        <div>
          <SubLabel>Type</SubLabel>
          <p className="text-sm break-all">{data?.kind}</p>
        </div>

        <FieldBlock className="space-y-2">
          <DetailLabel>CBOR</DetailLabel>
          <SubLabel className="leading-relaxed">
            The following bytes are CBOR-encoded structures. You can continue
            your decoding journey using these (hex-encoded) bytes and a CBOR
            decoder.
          </SubLabel>
          {data?.byronCbor && (
            <CodeBlock maxHeight="60">
              {data.byronCbor}
            </CodeBlock>
          )}
        </FieldBlock>
      </FieldBlock>
    </div>
  );
}
