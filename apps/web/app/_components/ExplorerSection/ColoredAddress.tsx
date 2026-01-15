import { type Address, isBase58 } from "@laceanatomy/types";
import { normalizeAddress } from "~/app/_utils/explorer";
import CopyButton from "./CopyButton";

export interface ColoredAddressProps {
  address: Address;
}

export default function ColoredAddress({ address }: ColoredAddressProps) {
  const normalizedAddress = normalizeAddress(address, "addr");
  const uncoloredPrefix = isBase58(normalizedAddress)
    ? ""
    : `${normalizedAddress.slice(0, 12)}...${normalizedAddress.slice(-13, -5)}`;
  const coloredSuffix = isBase58(normalizedAddress)
    ? `${normalizedAddress.slice(0, 7)}...${normalizedAddress.slice(-7)}`
    : normalizedAddress.slice(-5);

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
