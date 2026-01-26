"use client";
import { Select, SelectItem, type SharedSelection } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { ChangeEvent, FocusEvent, MouseEvent } from "react";
import { useConfigs } from "~/app/_contexts";
import { DEFAULT_DEVNET_PORT, ROUTES, USER_CONFIGS } from "~/app/_utils";
import { type ChainNetwork } from "~/server/api/dbsync-provider";

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
    key: "devnet",
    label: "Devnet",
    description: "Local devnet (localhost)",
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
    key: "vector-mainnet",
    label: "Vector",
    description: "AP3X Vector Mainnet",
  },
];

export interface ChainSelectorProps {
  currentChain: ChainNetwork;
}

interface PortInputProps {
  port: string;
  onPortChange: (port: string) => void;
}

const PortInput = ({ port, onPortChange }: PortInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      onPortChange(value);
    }
  };

  const handleClick = (e: MouseEvent<HTMLInputElement>) =>
    e.stopPropagation();
  const handleFocus = (e: FocusEvent<HTMLInputElement>) =>
    e.stopPropagation();

  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1">
      <span className="text-xs text-gray-500">localhost:</span>
      <input
        type="text"
        inputMode="numeric"
        className="w-[5ch] bg-transparent text-center font-mono text-xs outline-none"
        value={port}
        onChange={handleChange}
        onClick={handleClick}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default function ChainSelector({ currentChain }: ChainSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { configs, updateConfigs } = useConfigs();

  const handlePortChange = (port: string) => {
    updateConfigs(USER_CONFIGS.PORT, port);
  };

  const handleChainChange = useCallback(
    (keys: SharedSelection) => {
      if (keys === "all") return;
      const selectedKey = Array.from(keys)[0] as ChainNetwork;
      if (!selectedKey || selectedKey === currentChain) return;

      const params = new URLSearchParams(searchParams.toString());
      const query = params.toString();
      router.push(
        query
          ? `${ROUTES.EXPLORER_TXS(selectedKey)}?${query}`
          : ROUTES.EXPLORER_TXS(selectedKey),
      );
    },
    [currentChain, router, searchParams],
  );

  return (
    <Select
      placeholder="Select a network"
      labelPlacement="outside-left"
      selectedKeys={new Set([currentChain])}
      onSelectionChange={handleChainChange}
    >
      {CHAIN_OPTIONS.map((option) => (
        <SelectItem
          variant="flat"
          key={option.key}
          textValue={option.label}
          description={option.description}
          endContent={
            option.key === "devnet" ? (
              <PortInput
                port={configs.port || DEFAULT_DEVNET_PORT}
                onPortChange={handlePortChange}
              />
            ) : null
          }
        >
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
}
