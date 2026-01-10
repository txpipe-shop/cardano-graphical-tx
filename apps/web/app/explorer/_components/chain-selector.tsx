"use client";

import { Select, SelectItem, type SharedSelection } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type ChainNetwork = "mainnet" | "preprod" | "preview" | "vector";

interface ChainOption {
  key: ChainNetwork;
  label: string;
  description: string;
}

const CHAIN_OPTIONS: ChainOption[] = [
  {
    key: "mainnet",
    label: "Mainnet",
    description: "Cardano Mainnet",
  },
  {
    key: "preprod",
    label: "Preprod",
    description: "Pre-production testnet",
  },
  {
    key: "preview",
    label: "Preview",
    description: "Preview testnet",
  },
  {
    key: "vector",
    label: "Vector",
    description: "AP3X Vector Mainnet",
  },
];

interface ChainSelectorProps {
  currentChain: ChainNetwork;
}

export function ChainSelector({ currentChain }: ChainSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChainChange = useCallback(
    (keys: SharedSelection) => {
      if (keys === "all") return;
      const selectedKey = Array.from(keys)[0] as ChainNetwork;
      if (!selectedKey || selectedKey === currentChain) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("chain", selectedKey);
      router.push(`/explorer?${params.toString()}`);
    },
    [currentChain, router, searchParams],
  );

  return (
    <Select
      label="Network"
      placeholder="Select a network"
      selectedKeys={new Set([currentChain])}
      onSelectionChange={handleChainChange}
      className="max-w-xs"
      variant="bordered"
      classNames={{
        trigger: "border-2 border-dashed border-gray-300 shadow-md",
        label: "text-gray-600",
      }}
    >
      {CHAIN_OPTIONS.map((option) => (
        <SelectItem
          variant="flat"
          key={option.key}
          textValue={option.label}
          description={option.description}
        >
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
}
