"use client";

import { type Address, isBech32 } from "@laceanatomy/types";
import { normalizeAddress } from "~/app/_utils";
import CopyButton from "./CopyButton";

export interface ColoredAddressProps {
  address: Address;
  full?: boolean;
}

export default function ColoredAddress({
  address,
  full = false,
}: ColoredAddressProps) {
  const normalizedAddress = normalizeAddress(address);

  if (full) {
    const prefix = isBech32(normalizedAddress)
      ? normalizedAddress.slice(0, -5)
      : normalizedAddress;
    const suffix = isBech32(normalizedAddress)
      ? normalizedAddress.slice(-5)
      : "";

    return (
      <div className="flex items-center">
        <span className="font-mono text-xs text-p-primary break-all">
          {prefix}
          {suffix && (
            <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-bold text-transparent">
              {suffix}
            </span>
          )}
        </span>
        <CopyButton text={normalizedAddress} size={12} />
      </div>
    );
  }

  const uncoloredPrefix = isBech32(normalizedAddress)
    ? `${normalizedAddress.slice(0, 12)}...${normalizedAddress.slice(-13, -5)}`
    : "";
  const coloredSuffix = isBech32(normalizedAddress)
    ? normalizedAddress.slice(-5)
    : `${normalizedAddress.slice(0, 7)}...${normalizedAddress.slice(-7)}`;

  return (
    <div className="flex items-center">
      <span className="font-mono text-xs text-p-secondary">
        {uncoloredPrefix}
      </span>
      <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-mono text-xs font-bold text-transparent">
        {coloredSuffix}
      </span>
      <CopyButton text={normalizedAddress} size={12} />
    </div>
  );
}
