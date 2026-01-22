import {
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import {
  assetNameFromUnit,
  policyFromUnit,
  type Unit,
  type Value,
} from "@laceanatomy/types";
import { useState } from "react";

export interface TokenPillProps {
  unit: Unit;
  amount: bigint;
  mint: Value;
}

export default function TokenPill({ unit, amount, mint }: TokenPillProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const state =
    mint[unit] === undefined ? "default" : mint[unit] > 0n ? "mint" : "burn";

  const rawPolicy = String(policyFromUnit(unit));
  const rawName = String(assetNameFromUnit(unit));
  const displayUnit = unit === "lovelace" ? unit : `0x${unit}`;
  const displayName = Buffer.from(rawName, "hex").toString("ascii");

  const stateClasses = {
    mint: "border-green-200 bg-green-50 text-green-700",
    burn: "border-red-200 bg-red-50 text-red-700",
    default: "border-gray-200 bg-gray-50 text-gray-700",
  };

  return (
    <Tooltip content={displayUnit} placement="top" delay={150}>
      <div
        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-sm transition-colors ${stateClasses[state]}`}
      >
        <span className="font-semibold">{displayName}</span>
        <span className="font-mono text-[11px] opacity-90">
          {String(amount)}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Popover
            placement="bottom-end"
            isOpen={menuOpen}
            onOpenChange={setMenuOpen}
          >
            <PopoverTrigger>
              <button
                type="button"
                aria-label="Copy options"
                className="ml-1 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <DotsIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Listbox
                aria-label="Token copy options"
                selectionMode="single"
                onAction={(key) => {
                  const policy = rawPolicy;
                  const name = rawName;
                  const map: Record<string, string> = {
                    unit: String(unit),
                    policy,
                    name,
                  };
                  const value = map[key as string];
                  if (value !== undefined && navigator?.clipboard?.writeText) {
                    navigator.clipboard.writeText(value);
                  }
                  setMenuOpen(false);
                }}
              >
                <ListboxItem key="unit">Copy unit</ListboxItem>
                <ListboxItem key="policy">Copy policy</ListboxItem>
                <ListboxItem key="name">Copy name</ListboxItem>
              </Listbox>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Tooltip>
  );
}

function DotsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
