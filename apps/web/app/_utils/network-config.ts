export const NETWORK = {
  MAINNET: "mainnet",
  PREPROD: "preprod",
  PREVIEW: "preview",
  DEVNET: "devnet",
  VECTOR_MAINNET: "vector-mainnet",
} as const;
export type Network = (typeof NETWORK)[keyof typeof NETWORK];

export interface NetworkConfig {
  network: Network;
  addressPrefix: string;
  networkMagic?: number;
  nodeUrl?: string;
  dbSyncConnectionString?: string;
  displayName: string;
  description: string;
}

export const NETWORK_CONFIGS_BASE: Record<Network, NetworkConfig> = {
  mainnet: {
    network: "mainnet",
    addressPrefix: "addr",
    displayName: "Mainnet",
    description: "Cardano Mainnet",
  },
  preprod: {
    network: "preprod",
    addressPrefix: "addr_test",
    displayName: "Preprod",
    description: "Pre-production testnet",
  },
  preview: {
    network: "preview",
    addressPrefix: "addr_test",
    displayName: "Preview",
    description: "Preview testnet",
  },
  "vector-mainnet": {
    network: "vector-mainnet",
    addressPrefix: "addr",
    displayName: "Vector",
    description: "AP3X Vector Mainnet",
  },
  devnet: {
    network: "devnet",
    addressPrefix: "addr_test",
    displayName: "Devnet",
    description: "Local devnet (localhost)",
  },
};

export function getNetworkConfig(network: Network): NetworkConfig {
  return NETWORK_CONFIGS_BASE[network];
}

export function getAddressPrefix(network: Network): string {
  return NETWORK_CONFIGS_BASE[network].addressPrefix;
}

export function isValidChain(chain: string): chain is Network {
  return Object.keys(NETWORK_CONFIGS_BASE).includes(chain);
}
