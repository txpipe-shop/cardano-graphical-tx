import { Network, NETWORK_CONFIGS_BASE, NetworkConfig } from "~/app/_utils";
import { env } from "~/app/env.mjs";

const NETWORK_CONFIGS_SERVER: Record<Network, NetworkConfig> = {
  mainnet: {
    ...NETWORK_CONFIGS_BASE.mainnet,
    nodeUrl: env.MAINNET_NODE_URL,
    networkMagic: env.MAINNET_MAGIC,
    dbSyncConnectionString: env.MAINNET_DB_SYNC,
  },
  preprod: {
    ...NETWORK_CONFIGS_BASE.preprod,
    nodeUrl: env.PREPROD_NODE_URL,
    networkMagic: env.PREPROD_MAGIC,
    dbSyncConnectionString: env.PREPROD_DB_SYNC,
  },
  preview: {
    ...NETWORK_CONFIGS_BASE.preview,
    nodeUrl: env.PREVIEW_NODE_URL,
    networkMagic: env.PREVIEW_MAGIC,
    dbSyncConnectionString: env.PREVIEW_DB_SYNC,
  },
  vector: {
    ...NETWORK_CONFIGS_BASE.vector,
    nodeUrl: env.VECTOR_MAINNET_NODE_URL,
    networkMagic: env.VECTOR_MAINNET_MAGIC,
    dbSyncConnectionString: env.VECTOR_MAINNET_DB_SYNC,
  },
  devnet: {
    ...NETWORK_CONFIGS_BASE.devnet,
  },
};

export function getNetworkConfigServer(network: Network): NetworkConfig {
  return NETWORK_CONFIGS_SERVER[network];
}
