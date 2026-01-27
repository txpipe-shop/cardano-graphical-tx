"use client";

import { type U5CProvider } from "@laceanatomy/cardano-provider-u5c";
import { useMemo } from "react";
import { useConfigs } from "~/app/_contexts";
import { getU5CProviderWeb, resolveDevnetPort } from "~/app/_utils";
import {
  getAddressPrefix,
  getNetworkConfig,
  NETWORK,
  type Network,
  type NetworkConfig,
} from "~/app/_utils/network-config";

export interface UseNetworkReturn {
  config: NetworkConfig;
  network: Network;
  addressPrefix: string;
  devnetPort: number;
  getU5CProvider: () => U5CProvider | null;
  isProviderAvailable: boolean;
}

export function useNetwork(): UseNetworkReturn {
  const { configs } = useConfigs();
  const network = configs.net as Network;
  const devnetPort = useMemo(
    () => resolveDevnetPort(configs.port),
    [configs.port],
  );

  const config = useMemo(() => getNetworkConfig(network), [network]);
  const addressPrefix = useMemo(() => getAddressPrefix(network), [network]);

  const getU5CProvider = useMemo(
    () => () => {
      if (network === NETWORK.DEVNET) {
        return getU5CProviderWeb(devnetPort);
      }
      return null;
    },
    [network, devnetPort],
  );

  const isProviderAvailable = useMemo(() => {
    return network === NETWORK.DEVNET;
  }, [network]);

  return {
    config,
    network,
    addressPrefix,
    devnetPort,
    getU5CProvider,
    isProviderAvailable,
  };
}
