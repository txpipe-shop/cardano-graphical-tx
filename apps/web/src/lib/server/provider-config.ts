import { privateEnv } from '@/private-env';
import { LOCAL_PROVIDER_ID, type ProviderConfig } from '@/client';

export function getServerProviders(): ProviderConfig[] {
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
      isLocal: false
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
      isLocal: false
    },
    {
      id: LOCAL_PROVIDER_ID,
      name: 'Local (Dolos)',
      description:
        'UTxORPC + MiniBlockfrost services for Cardano Local testnet. Not realiable for older queries',
      miniBfUrl: privateEnv.LOCAL_BLOCKFROST_URL,
      utxoRpcUrl: privateEnv.LOCAL_UTXORPC_URL,
      type: 'dolos',
      network: 'custom',
      isLocal: true
    }
  ];
}

//get client-safe configs
export function getClientProviders(): ProviderConfig[] {
  return getServerProviders().map((config) => {
    if (config.type === 'dolos' && !config.isLocal) {
      const { utxoRpcUrl, utxoRpcApiKey, miniBfUrl, miniBfApiKey, ...clientConfig } = config;
      return clientConfig;
    }
    return config;
  });
}

export function getProviderById(id: string): ProviderConfig | undefined {
  return getServerProviders().find((p) => p.id === id);
}

export function getProvidersByType(type: ProviderConfig['type']): ProviderConfig[] {
  return getServerProviders().filter((p) => p.type === type);
}

export function getProvidersByNetwork(network: ProviderConfig['network']): ProviderConfig[] {
  return getServerProviders().filter((p) => p.network === network);
}
