"use client";

import { type Address, isBech32 } from "@laceanatomy/types";
import Link from "next/link";
import { ROUTES, normalizeAddress } from "~/app/_utils";
import { type Network } from "~/app/_utils/network-config";
import CopyButton from "./CopyButton";

export interface ColoredAddressProps {
  address: Address;
  chain?: Network;
  full?: boolean;
}

export default function ColoredAddress({
  address,
  chain,
  full = false,
}: ColoredAddressProps) {
  const normalizedAddress = normalizeAddress(address);
  const addressLink = chain
    ? ROUTES.EXPLORER_ADDRESS(chain, normalizedAddress)
    : null;

  const isBech = isBech32(normalizedAddress);

  let prefix: string;
  let suffix: string;

  if (isBech) {
    if (full) {
      prefix = normalizedAddress.slice(0, -5);
      suffix = normalizedAddress.slice(-5);
    } else {
      prefix = `${normalizedAddress.slice(0, 12)}...${normalizedAddress.slice(-13, -5)}`;
      suffix = normalizedAddress.slice(-5);
    }
  } else {
    if (full) {
      prefix = normalizedAddress;
      suffix = "";
    } else {
      prefix = "";
      suffix = `${normalizedAddress.slice(0, 7)}...${normalizedAddress.slice(-7)}`;
    }
  }

  return (
    <div className="flex items-center">
      {addressLink ? (
        <Link
          href={addressLink}
          className="group inline-flex items-center font-mono text-xs text-p-secondary hover:underline"
          title={normalizedAddress}
        >
          <span>{prefix}</span>
          {suffix && (
            <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-bold text-transparent group-hover:underline">
              {suffix}
            </span>
          )}
        </Link>
      ) : (
        <>
          <span className="font-mono text-xs text-p-secondary">{prefix}</span>
          {suffix && (
            <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text font-mono text-xs font-bold text-transparent">
              {suffix}
            </span>
          )}
        </>
      )}
      <CopyButton text={normalizedAddress} size={12} />
    </div>
  );
}
