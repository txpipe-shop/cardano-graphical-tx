import { privateEnv } from '@/private-env';
import type { ProviderConfig } from '@/types/provider-config';

export function getServerProviderConfigs(): ProviderConfig[] {
  return [
    {
      id: 'preprod-dolos',
      name: 'Preprod (Dolos)',
      description:
        'UTxORPC + MiniBlockfrost services for Cardano Preprod testnet. Not realiable for older queries',
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
      description:
        'UTxORPC + MiniBlockfrost services for Cardano Preview testnet. Not realiable for older queries',
      miniBfUrl: privateEnv.PREVIEW_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.PREVIEW_BLOCKFROST_API_KEY,
      utxoRpcUrl: privateEnv.PREVIEW_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.PREVIEW_UTXORPC_API_KEY,
      type: 'dolos',
      network: 'preview',
      isBuiltIn: true
    },
    {
      id: 'local-dolos',
      name: 'Local (Dolos)',
      description:
        'UTxORPC + MiniBlockfrost services for Cardano Local testnet. Not realiable for older queries',
      miniBfUrl: privateEnv.LOCAL_BLOCKFROST_URL,
      miniBfApiKey: 'a',
      utxoRpcUrl: privateEnv.LOCAL_UTXORPC_URL,
      utxoRpcApiKey: 'a',
      type: 'dolos',
      network: 'custom',
      isBuiltIn: false
    }
  ];
}

//get client-safe configs
export function getClientProviderConfigs(): ProviderConfig[] {
  return getServerProviderConfigs().map((config) => {
    if (config.type === 'dolos' && config.isBuiltIn) {
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
