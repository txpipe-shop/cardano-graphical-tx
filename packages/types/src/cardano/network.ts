export const NETWORK = {
  MAINNET: 'mainnet',
  PREPROD: 'preprod',
  PREVIEW: 'preview',
  DEVNET: 'devnet'
} as const;
export type Network = (typeof NETWORK)[keyof typeof NETWORK];

export interface NetworkConfig {
  network: Network;
  addressPrefix: string;
  dolosBlockfrostUrl?: string;
  dolosBlockfrostApiKey?: string;
  dolosUtxorpcUrl?: string;
  dolosUtxorpcApiKey?: string;
  displayName: string;
  description: string;
}

export const NETWORK_CONFIGS_BASE: Record<Network, NetworkConfig> = {
  devnet: {
    network: 'devnet',
    addressPrefix: 'addr_test',
    displayName: 'Devnet',
    description: 'Local devnet (localhost)'
  },
  mainnet: {
    network: 'mainnet',
    addressPrefix: 'addr',
    displayName: 'Mainnet',
    description: 'Cardano Mainnet'
  },
  preprod: {
    network: 'preprod',
    addressPrefix: 'addr_test',
    displayName: 'Preprod',
    description: 'Pre-production testnet'
  },
  preview: {
    network: 'preview',
    addressPrefix: 'addr_test',
    displayName: 'Preview',
    description: 'Preview testnet'
  }
};

export function getNetworkConfig(network: Network): NetworkConfig {
  return NETWORK_CONFIGS_BASE[network];
}

export function isValidChain(chain: string): chain is Network {
  return Object.keys(NETWORK_CONFIGS_BASE).includes(chain);
}

export const NETWORK_ID: Record<Network, number> = {
  mainnet: 1,
  preprod: 0,
  preview: 0,
  devnet: 0
};

export const NETWORK_MAGIC: Record<Network, number> = {
  mainnet: 764824073,
  preprod: 1,
  preview: 2,
  devnet: 42
};

export const SHELLEY_START_SECONDS: Record<Network, number> = {
  mainnet: 1596491091,
  preprod: 1655769600,
  preview: 1660003200,
  devnet: 1660003200
};

export const PRE_BYRON_SLOT_OFFSET: Record<Network, number> = {
  mainnet: 4924800,
  preprod: 86400,
  preview: 0,
  devnet: 0
};

export const SENTINEL_MAXIMUM_EPOCH = 999999999n;

export function currentSlot(
  network: Network,
  nowSec: number = Math.floor(Date.now() / 1000)
): number {
  return Math.max(0, nowSec - SHELLEY_START_SECONDS[network] + PRE_BYRON_SLOT_OFFSET[network]);
}
