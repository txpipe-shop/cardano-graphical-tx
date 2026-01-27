import { Network, NETWORK_CONFIGS_BASE, NetworkConfig } from "~/app/_utils";
import { env } from "~/app/env.mjs";

const NETWORK_CONFIGS_SERVER: Record<Network, NetworkConfig> = {
  mainnet: {
    ...NETWORK_CONFIGS_BASE.mainnet,
    nodeUrl: env.MAINNET_NODE_URL || undefined,
    networkMagic: env.MAINNET_MAGIC || undefined,
    dbSyncConnectionString: env.MAINNET_DB_SYNC || undefined,
  },
  preprod: {
    ...NETWORK_CONFIGS_BASE.preprod,
    nodeUrl: env.PREPROD_NODE_URL || undefined,
    networkMagic: env.PREPROD_MAGIC || undefined,
    dbSyncConnectionString: env.PREPROD_DB_SYNC || undefined,
  },
  preview: {
    ...NETWORK_CONFIGS_BASE.preview,
    nodeUrl: env.PREVIEW_NODE_URL || undefined,
    networkMagic: env.PREVIEW_MAGIC || undefined,
    dbSyncConnectionString: env.PREVIEW_DB_SYNC || undefined,
  },
  "vector-mainnet": {
    ...NETWORK_CONFIGS_BASE["vector-mainnet"],
    nodeUrl: env.VECTOR_MAINNET_NODE_URL || undefined,
    networkMagic: env.VECTOR_MAINNET_MAGIC || undefined,
    dbSyncConnectionString: env.VECTOR_MAINNET_DB_SYNC || undefined,
  },
  devnet: {
    ...NETWORK_CONFIGS_BASE.devnet,
  },
}

export function getNetworkConfigServer(
  network: Network,
): NetworkConfig {
  return NETWORK_CONFIGS_SERVER[network]
}