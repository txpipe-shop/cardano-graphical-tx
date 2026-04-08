import { Network, NETWORK_CONFIGS_BASE, NetworkConfig } from "~/app/_utils";
import { env } from "~/app/env.mjs";

const NETWORK_CONFIGS_SERVER: Record<Network, NetworkConfig> = {
  mainnet: {
    ...NETWORK_CONFIGS_BASE.mainnet,
    dolosBlockfrostUrl: env.MAINNET_DOLOS_BLOCKFROST_URL,
    dolosBlockfrostApiKey: env.MAINNET_DOLOS_BLOCKFROST_API_KEY,
    dolosUtxorpcUrl: env.MAINNET_DOLOS_UTXORPC_URL,
    dolosUtxorpcApiKey: env.MAINNET_DOLOS_UTXORPC_API_KEY,
  },
  preprod: {
    ...NETWORK_CONFIGS_BASE.preprod,
    dolosBlockfrostUrl: env.PREPROD_DOLOS_BLOCKFROST_URL,
    dolosBlockfrostApiKey: env.PREPROD_DOLOS_BLOCKFROST_API_KEY,
    dolosUtxorpcUrl: env.PREPROD_DOLOS_UTXORPC_URL,
    dolosUtxorpcApiKey: env.PREPROD_DOLOS_UTXORPC_API_KEY,
  },
  preview: {
    ...NETWORK_CONFIGS_BASE.preview,
    dolosBlockfrostUrl: env.PREVIEW_DOLOS_BLOCKFROST_URL,
    dolosBlockfrostApiKey: env.PREVIEW_DOLOS_BLOCKFROST_API_KEY,
    dolosUtxorpcUrl: env.PREVIEW_DOLOS_UTXORPC_URL,
    dolosUtxorpcApiKey: env.PREVIEW_DOLOS_UTXORPC_API_KEY,
  },
  vector: {
    ...NETWORK_CONFIGS_BASE.vector,
  },
  devnet: {
    ...NETWORK_CONFIGS_BASE.devnet,
  },
};

export function getNetworkConfigServer(network: Network): NetworkConfig {
  return NETWORK_CONFIGS_SERVER[network];
}
