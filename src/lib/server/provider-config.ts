import { privateEnv } from '@/private-env';
import type { ProviderConfig } from '@/types/provider-config';

export function getServerProviderConfigs(): ProviderConfig[] {
  return [
    {
      id: 'preprod-dolos',
      name: 'Preprod (Dolos)',
      description: 'UTxORPC + MiniBlockfrost services for Cardano Preprod testnet. Not realiable for older queries',
      miniBfUrl: privateEnv.PREPROD_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.PREPROD_BLOCKFROST_API_KEY,
      utxoRpcUrl: privateEnv.PREPROD_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.PREPROD_UTXORPC_API_KEY,
      type: 'dolos',
      network: 'preprod',
      isBuiltIn: true
    },
    {
      id: 'preview-dolos',
      name: 'Preview (Dolos)',
      description: 'UTxORPC + MiniBlockfrost services for Cardano Preview testnet. Not realiable for older queries',
      miniBfUrl: privateEnv.PREVIEW_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.PREVIEW_BLOCKFROST_API_KEY,
      utxoRpcUrl: privateEnv.PREVIEW_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.PREVIEW_UTXORPC_API_KEY,
      type: 'dolos',
      network: 'preview',
      isBuiltIn: true
    },
    {
      id: 'mainnet-dolos',
      name: 'Mainnet (Dolos)',
      description: 'UTxORPC + MiniBlockfrost services for Cardano Mainnet. Not realiable for older queries',
      miniBfUrl: privateEnv.MAINNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.MAINNET_BLOCKFROST_API_KEY,
      utxoRpcUrl: privateEnv.MAINNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.MAINNET_UTXORPC_API_KEY,
      type: 'dolos',
      network: 'mainnet',
      isBuiltIn: true
    },
    {
      id: 'vector-testnet',
      name: 'Vector Testnet (Dolos)',
      description: "UTxORPC + MiniBlockfrost services for Apex Fusion's Vector Testnet. Not realiable for older queries",
      utxoRpcUrl: privateEnv.AF_VECTOR_TESTNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_VECTOR_TESTNET_UTXORPC_API_KEY,
      miniBfUrl: privateEnv.AF_VECTOR_TESTNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_VECTOR_TESTNET_BLOCKFROST_API_KEY,
      type: 'dolos',
      network: 'afvt',
      isBuiltIn: true
    },
    {
      id: 'vector-mainnet',
      name: 'Vector Mainnet (Dolos)',
      description: "UTxORPC + MiniBlockfrost services for Apex Fusion's Vector Mainnet. Not realiable for older queries",
      miniBfUrl: privateEnv.AF_VECTOR_MAINNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_VECTOR_MAINNET_BLOCKFROST_API_KEY,
      utxoRpcUrl: privateEnv.AF_VECTOR_MAINNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_VECTOR_MAINNET_UTXORPC_API_KEY,
      type: 'dolos',
      network: 'afvm',
      isBuiltIn: true
    },
    {
      id: 'prime-testnet',
      name: 'Prime Testnet (Dolos)',
      description: "UTxORPC + MiniBlockfrost services for Apex Fusion's Prime Testnet. Not realiable for older queries",
      utxoRpcUrl: privateEnv.AF_PRIME_TESTNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_PRIME_TESTNET_UTXORPC_API_KEY,
      miniBfUrl: privateEnv.AF_PRIME_TESTNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_PRIME_TESTNET_BLOCKFROST_API_KEY,
      type: 'dolos',
      network: 'afpt',
      isBuiltIn: true
    },
    {
      id: 'prime-mainnet',
      name: 'Prime Mainnet (Dolos)',
      description: "UTxORPC + MiniBlockfrost services for Apex Fusion's Prime Mainnet. Not realiable for older queries",
      utxoRpcUrl: privateEnv.AF_PRIME_MAINNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_PRIME_MAINNET_UTXORPC_API_KEY,
      miniBfUrl: privateEnv.AF_PRIME_MAINNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_PRIME_MAINNET_BLOCKFROST_API_KEY,
      type: 'dolos',
      network: 'afpm',
      isBuiltIn: true
    }
  ];
}

//get client-safe configs
export function getClientProviderConfigs(): ProviderConfig[] {
  return getServerProviderConfigs().map((config) => {
    if (config.type === 'dolos') {
      const { utxoRpcUrl, utxoRpcApiKey, miniBfUrl, miniBfApiKey, ...clientConfig } = config;
      return clientConfig;
    }
    return config;
  });
}

export function getProviderById(id: string): ProviderConfig | undefined {
  return getServerProviderConfigs().find((p) => p.id === id);
}

export function getProvidersByType(type: ProviderConfig['type']): ProviderConfig[] {
  return getServerProviderConfigs().filter((p) => p.type === type);
}

export function getProvidersByNetwork(network: ProviderConfig['network']): ProviderConfig[] {
  return getServerProviderConfigs().filter((p) => p.network === network);
}
