import { privateEnv } from '@/private-env';
import { LOCAL_PROVIDER_ID, type ProviderConfig } from '@/providers/types';

export function getServerProviders(): ProviderConfig[] {
  return [
    {
      id: 'preprod',
      name: 'Preprod',
      type: 'dbsync',
      description: 'Cardano Db Sync for Cardano Preprod Testnet',
      network: 'preprod',
      isActive: false,
      connectionString: privateEnv.PREPROD_DB_SYNC_CONNECTION_STRING,
      browser: false
    },
    {
      id: 'preview',
      name: 'Preview',
      description: 'Cardano Db Sync for Cardano Preview Testnet',
      type: 'dbsync',
      network: 'preview',
      isActive: false,
      connectionString: privateEnv.PREVIEW_DB_SYNC_CONNECTION_STRING,
      browser: false
    },
    {
      id: 'mainnet',
      name: 'Mainnet',
      description: 'Cardano Db Sync for Cardano',
      type: 'dbsync',
      isActive: false,
      network: 'preview',
      connectionString: privateEnv.MAINNET_DB_SYNC_CONNECTION_STRING,
      browser: false
    },
    {
      id: 'afvm',
      name: 'AP3X Vector Mainnet',
      description: 'AP3X Vector Mainnet Db Sync',
      type: 'dbsync',
      network: 'afvm',
      isActive: false,
      connectionString: privateEnv.AFVM_DB_SYNC_CONNECTION_STRING,
      browser: false
    },
    {
      id: LOCAL_PROVIDER_ID,
      name: 'Local (Dolos)',
      description:
        'UTxORPC + MiniBlockfrost services for Cardano Local testnet. Not realiable for older queries',
      utxoRpcUrl: privateEnv.LOCAL_UTXORPC_URL,
      type: 'u5c',
      network: 'devnet',
      isActive: false,
      browser: true
    }
  ];
}

//get client-safe configs
export function getClientProviders(): ProviderConfig[] {
  return getServerProviders().map((config) => {
    if (config.browser) {
      switch (config.type) {
        case 'u5c': {
          return {
            utxoRpcUrl: '',
            utxoRpcApiKey: '',
            type: config.type,
            browser: config.browser,
            description: config.description,
            id: config.id,
            isActive: config.isActive,
            name: config.name,
            network: config.network
          };
        }
        default:
          throw new Error(`Unsupported provider type for client: ${config.type}`);
      }
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
