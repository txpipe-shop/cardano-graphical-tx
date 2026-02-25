export const NETWORK = {
  MAINNET: "mainnet",
  PREPROD: "preprod",
  PREVIEW: "preview",
  DEVNET: "devnet",
  VECTOR: "vector",
} as const;
export type Network = (typeof NETWORK)[keyof typeof NETWORK];

export interface NetworkConfig {
  network: Network;
  addressPrefix: string;
  networkMagic?: number;
  nodeUrl?: string;
  dbSyncConnectionString?: string;
  dolosUtxorpcUrl?: string;
  dolosMinibfUrl?: string;
  displayName: string;
  description: string;
}

export const NETWORK_CONFIGS_BASE: Record<Network, NetworkConfig> = {
  devnet: {
    network: "devnet",
    addressPrefix: "addr_test",
    displayName: "Devnet",
    description: "Local devnet (localhost)",
  },
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
  vector: {
    network: "vector",
    addressPrefix: "addr",
    displayName: "Vector",
    description: "Coming soon...", //"AP3X Vector Mainnet",
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
