"use client";

import { Button, Input } from "@heroui/react";
import { NETWORK, type Network } from "@laceanatomy/types/cardano";
import { useConfigs } from "~/app/_contexts";
import { DEFAULT_DEVNET_PORT, USER_CONFIGS } from "~/app/_utils";
import { NetworkSelector } from "./NetworkSelector";

interface HashInputBarProps {
  hashInput: string;
  onHashInputChange: (value: string) => void;
  onFetch: () => void;
  isFetching: boolean;
}

export function HashInputBar({
  hashInput,
  onHashInputChange,
  onFetch,
  isFetching,
}: HashInputBarProps) {
  const { configs, updateConfigs } = useConfigs();
  const network = configs.net as Network;
  const isDevnet = network === NETWORK.DEVNET;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <NetworkSelector />
      {isDevnet && (
        <Input
          value={configs.port || DEFAULT_DEVNET_PORT}
          onValueChange={(value) => updateConfigs(USER_CONFIGS.PORT, value)}
          placeholder="Port"
          className="w-24"
          size="sm"
          variant="bordered"
        />
      )}
      <Input
        value={hashInput}
        onValueChange={onHashInputChange}
        placeholder="Transaction hash..."
        variant="bordered"
        className="flex-1"
        size="sm"
      />
      <Button
        variant="flat"
        className="shrink-0 font-mono shadow-md"
        size="sm"
        onPress={onFetch}
        isLoading={isFetching}
      >
        Fetch
      </Button>
    </div>
  );
}
