"use client";

import { type Address, isBech32 } from "@laceanatomy/types";
import { useNetwork } from "~/app/_hooks/useNetwork";
import { normalizeAddress } from "~/app/_utils";
import CopyButton from "./CopyButton";

export interface ColoredAddressProps {
  address: Address;
}

export default function ColoredAddress({
  address,
}: ColoredAddressProps) {
  const { addressPrefix } = useNetwork();
  const normalizedAddress = normalizeAddress(address, addressPrefix);
  const uncoloredPrefix = isBech32(normalizedAddress)
    ? `${normalizedAddress.slice(0, 12)}...${normalizedAddress.slice(-13, -5)}`
    : "";
  const coloredSuffix = isBech32(normalizedAddress)
    ? normalizedAddress.slice(-5)
    : `${normalizedAddress.slice(0, 7)}...${normalizedAddress.slice(-7)}`;

  return (
    <div className="flex items-center">
      <span className="font-mono text-xs text-gray-600">{uncoloredPrefix}</span>
      <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-mono text-xs font-bold text-transparent">
        {coloredSuffix}
      </span>
      <CopyButton text={normalizedAddress} size={12} />
    </div>
  );
}
