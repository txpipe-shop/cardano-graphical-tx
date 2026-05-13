"use client";

import { type Address, isBech32 } from "@laceanatomy/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ROUTES, normalizeAddress } from "~/app/_utils";
import { type Network } from "~/app/_utils/network-config";
import CopyButton from "./CopyButton";

export interface ColoredAddressProps {
  address: Address;
  full?: boolean;
}

export default function ColoredAddress({
  address,
  full = false,
}: ColoredAddressProps) {
  const params = useParams();
  const chain = (params?.chain as Network | undefined) ?? undefined;
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

  const addressLink = chain
    ? ROUTES.EXPLORER_ADDRESS(chain, normalizedAddress)
    : null;

  return (
    <div className="flex items-center">
      {addressLink ? (
        <Link
          href={addressLink}
          className="group inline-flex items-center font-mono text-xs text-p-secondary hover:underline"
          title={normalizedAddress}
        >
          <span>{uncoloredPrefix}</span>
          <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-bold text-transparent group-hover:underline">
            {coloredSuffix}
          </span>
        </Link>
      ) : (
        <>
          <span className="font-mono text-xs text-p-secondary">
            {uncoloredPrefix}
          </span>
          <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-mono text-xs font-bold text-transparent">
            {coloredSuffix}
          </span>
        </>
      )}
      <CopyButton text={normalizedAddress} size={12} />
    </div>
  );
}
