import { assetNameFromUnit, type Unit, type Value } from "@laceanatomy/types";

export interface TokenPillProps {
  unit: Unit;
  amount: bigint;
  mint: Value;
}

export default function TokenPill({ unit, amount, mint }: TokenPillProps) {
  const state =
    mint[unit] === undefined ? "default" : mint[unit] > 0n ? "mint" : "burn";

  const stateClasses = {
    mint: "border-green-200 bg-green-50 text-green-700",
    burn: "border-red-200 bg-red-50 text-red-700",
    default: "border-gray-200 bg-gray-50 text-gray-700",
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-sm transition-colors ${stateClasses[state]}`}
    >
      <span className="font-semibold">{assetNameFromUnit(unit)}</span>
      <span className="font-mono text-[11px] opacity-90">{String(amount)}</span>
    </div>
  );
}
