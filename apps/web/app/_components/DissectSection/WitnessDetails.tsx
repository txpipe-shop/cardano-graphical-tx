import type { Bootstrap, Witnesses } from "@laceanatomy/napi-pallas";
import { CodeBlock } from "~/app/_components/CodeBlock";
import { DetailLabel } from "~/app/_components/DetailLabel";
import CopyButton from "~/app/_components/ExplorerSection/CopyButton";
import { MonoText } from "~/app/_components/MonoText";
import { SubLabel } from "~/app/_components/SubLabel";
import { JSONBIG } from "~/app/_utils";

export function VKeyDetail({ items }: { items: Witnesses["vkeyWitnesses"] }) {
  return (
    <div className="space-y-2">
      {items.map((w, i) => (
        <div key={i} className="border border-border bg-surface rounded">
          <div className="px-4 py-2 bg-explorer-row border-b border-border flex items-center gap-2">
            <MonoText size="xs" className="font-bold text-p-primary">
              #{i}
            </MonoText>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-start gap-4 px-4 py-3">
              <DetailLabel className="w-16 flex-shrink-0">Key</DetailLabel>
              <MonoText>{w.key}</MonoText>
            </div>
            <div className="flex items-start gap-4 px-4 py-3">
              <DetailLabel className="w-16 flex-shrink-0">Hash</DetailLabel>
              <MonoText>{w.hash}</MonoText>
            </div>
            <div className="flex items-start gap-4 px-4 py-3">
              <DetailLabel className="w-16 flex-shrink-0">Sig</DetailLabel>
              <MonoText>{w.signature}</MonoText>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RedeemerDetail({ r }: { r: Witnesses["redeemers"][number] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MonoText className="font-bold">{r.tag}</MonoText>
        <SubLabel className="font-mono">index {r.index}</SubLabel>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <DetailLabel>Ex Mem</DetailLabel>
          <MonoText>{r.exUnits.mem.toFixed(0)}</MonoText>
        </div>
        <div>
          <DetailLabel>Ex Steps</DetailLabel>
          <MonoText>{r.exUnits.steps.toFixed(0)}</MonoText>
        </div>
      </div>
      <div>
        <DetailLabel>Data</DetailLabel>
        <CodeBlock>
          {JSONBIG.stringify(JSON.parse(r.dataJson), null, 2)}
        </CodeBlock>
      </div>
    </div>
  );
}

export function ScriptList({
  items,
  label,
}: {
  items: string[];
  label: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      {items.map((script, i) => (
        <div
          key={i}
          className="border border-border bg-surface rounded overflow-hidden"
        >
          <div className="px-4 py-2 bg-explorer-row border-b border-border flex items-center gap-2">
            <MonoText size="xs" className="font-bold text-p-primary">
              {label} #{i}
            </MonoText>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-2">
              <MonoText
                size="xs"
                className="break-all flex-1 min-w-0 leading-relaxed"
              >
                {script}
              </MonoText>
              <CopyButton text={script} size={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BootstrapDetail({ items }: { items: Bootstrap[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      {items.map((bw, i) => (
        <div
          key={i}
          className="border border-border bg-surface rounded overflow-hidden"
        >
          <div className="px-4 py-2 bg-explorer-row border-b border-border flex items-center gap-2">
            <MonoText size="xs" className="font-bold text-p-primary">
              Bootstrap #{i}
            </MonoText>
          </div>
          <div className="divide-y divide-border/50">
            <HexRow label="Public Key" value={bw.publicKey} />
            <HexRow label="Signature" value={bw.signature} />
            <HexRow label="Chain Code" value={bw.chainCode} />
            <HexRow label="Attributes" value={bw.attributes} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HexRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <DetailLabel className="w-24 flex-shrink-0">{label}</DetailLabel>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <MonoText>{value}</MonoText>
        <CopyButton text={value} size={12} />
      </div>
    </div>
  );
}

export function PlutusDetail({ d }: { d: Witnesses["plutusData"][number] }) {
  return (
    <div className="space-y-3">
      <div>
        <DetailLabel>Hash</DetailLabel>
        <MonoText>{d.hash}</MonoText>
      </div>
      {d.bytes && (
        <div>
          <DetailLabel>Bytes</DetailLabel>
          <CodeBlock maxHeight="60">{d.bytes}</CodeBlock>
        </div>
      )}
      {d.json && (
        <div>
          <DetailLabel>JSON</DetailLabel>
          <CodeBlock>{d.json}</CodeBlock>
        </div>
      )}
    </div>
  );
}
