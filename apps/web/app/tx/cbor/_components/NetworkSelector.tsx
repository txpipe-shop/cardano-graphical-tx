"use client";

import { Chip, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { NETWORK, type Network } from "@laceanatomy/types/cardano";
import { useEffect } from "react";
import { useConfigs } from "~/app/_contexts";
import { USER_CONFIGS } from "~/app/_utils";

const NETWORKS = Object.values(NETWORK).filter(
  (value) => value !== NETWORK.DEVNET,
);

export function NetworkSelector() {
  const { configs, updateConfigs } = useConfigs();
  const network = configs.net as Network;
  const selectedNetwork = network === NETWORK.DEVNET ? NETWORK.MAINNET : network;

  useEffect(() => {
    if (network === NETWORK.DEVNET) {
      updateConfigs(USER_CONFIGS.NET, NETWORK.MAINNET);
    }
  }, [network, updateConfigs]);

  return (
    <Popover placement="bottom" showArrow>
      <PopoverTrigger>
        <Chip
          variant="dot"
          color="success"
          size="lg"
          className="cursor-pointer capitalize border-border"
        >
          {selectedNetwork}
        </Chip>
      </PopoverTrigger>
      <PopoverContent className="flex gap-1">
        {NETWORKS.map((value) => (
          <Chip
            key={value}
            variant="dot"
            color={selectedNetwork === value ? "success" : "danger"}
            className="cursor-pointer capitalize min-w-full text-center"
            onClick={() => updateConfigs(USER_CONFIGS.NET, value as Network)}
          >
            {value}
          </Chip>
        ))}
      </PopoverContent>
    </Popover>
  );
}
