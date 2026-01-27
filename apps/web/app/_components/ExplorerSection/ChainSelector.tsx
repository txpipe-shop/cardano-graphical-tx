"use client";
import { Select, SelectItem, type SharedSelection } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, SyntheticEvent } from "react";
import { useCallback } from "react";
import { useConfigs } from "~/app/_contexts";
import { DEFAULT_DEVNET_PORT, ROUTES, USER_CONFIGS } from "~/app/_utils";
import { NETWORK, NETWORK_CONFIGS_BASE, type Network } from "~/app/_utils/network-config";

export interface ChainSelectorProps {
  currentChain: Network;
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

  const stopPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1"
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <input
        type="text"
        inputMode="numeric"
        className="w-[5ch] bg-transparent text-center font-mono text-xs outline-none"
        value={port}
        onChange={handleChange}
        onClick={stopPropagation}
        onFocus={stopPropagation}
        onMouseDown={stopPropagation}
        onPointerDown={stopPropagation}
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
      const selectedKey = Array.from(keys)[0] as Network;
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
      aria-label="Select a network"
      placeholder="Select a network"
      labelPlacement="outside-left"
      selectedKeys={new Set([currentChain])}
      onSelectionChange={handleChainChange}
      endContent={
        currentChain === NETWORK.DEVNET ? (
          <PortInput
            port={configs.port || DEFAULT_DEVNET_PORT}
            onPortChange={handlePortChange}
          />
        ) : null
      }
    >
      {Object.values(NETWORK_CONFIGS_BASE).map((option) => (
        <SelectItem
          variant="flat"
          key={option.network}
          textValue={option.displayName}
          description={option.description}
        >
          {option.displayName}
        </SelectItem>
      ))}
    </Select>
  );
}
