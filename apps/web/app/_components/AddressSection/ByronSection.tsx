import type { AddressDiagnostic } from "@laceanatomy/napi-pallas";
import { CodeBlock } from "~/app/_components/CodeBlock";
import { DetailLabel } from "~/app/_components/DetailLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";

export function ByronSection({ data }: { data: AddressDiagnostic }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-p-secondary leading-relaxed">
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
        <div>
          <p className="text-xs text-p-secondary">Type</p>
          <p className="text-sm break-all">{data?.kind}</p>
        </div>

        <div className="border border-border/50 bg-explorer-row/30 px-3 py-2 rounded space-y-2">
          <DetailLabel>CBOR</DetailLabel>
          <p className="text-xs text-p-secondary leading-relaxed">
            The following bytes are CBOR-encoded structures. You can continue
            your decoding journey using these (hex-encoded) bytes and a CBOR
            decoder.
          </p>
          {data?.byronCbor && (
            <CodeBlock maxHeight="60">
              {data.byronCbor}
            </CodeBlock>
          )}
        </div>
      </div>
    </div>
  );
}
