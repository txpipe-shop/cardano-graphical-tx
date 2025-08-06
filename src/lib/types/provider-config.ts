// Builtin providers do not have URLs or credentials exposed here

export type Network =
  | 'mainnet'
  | 'preprod'
  | 'preview'
  | 'afvt'
  | 'afpt'
  | 'afvm'
  | 'afpm'
  | 'custom';

export interface DolosConfig {
  id: string;
  name: string;
  description: string;
  type: 'dolos';
  network: Network;
  isBuiltIn: boolean;
  isActive?: boolean;
  // Not set for built-in providers
  utxoRpcUrl?: string;
  utxoRpcApiKey?: string;
  miniBfUrl?: string;
  miniBfApiKey?: string;
}

export interface DbSyncConfig {
  id: string;
  name: string;
  description: string;
  type: 'dbsync';
  network: Network;
  isBuiltIn: boolean;
  isActive?: boolean;
  // Not set for built-in providers
  connectionString?: string;
}

export type ProviderConfig = DolosConfig | DbSyncConfig;

export const BUILTIN_PROVIDERS: ProviderConfig[] = [
  {
    id: 'preprod-dolos',
    name: 'Preprod (Dolos)',
    type: 'dolos',
    description:
      'UTxORPC + MiniBlockfrost services for Cardano Preprod testnet. Not realiable for older queries',
    network: 'preprod',
    isBuiltIn: true
  },
  {
    id: 'preview-dolos',
    name: 'Preview (Dolos)',
    type: 'dolos',
    description:
      'UTxORPC + MiniBlockfrost services for Cardano Preview testnet. Not realiable for older queries',
    network: 'preview',
    isBuiltIn: true
  },
  {
    id: 'mainnet-dolos',
    name: 'Mainnet (Dolos)',
    type: 'dolos',
    description:
      'UTxORPC + MiniBlockfrost services for Cardano Mainnet. Not realiable for older queries',
    network: 'mainnet',
    isBuiltIn: true
  },
  {
    id: 'vector-testnet',
    name: 'Vector Testnet (Dolos)',
    type: 'dolos',
    description:
      "UTxORPC + MiniBlockfrost services for Apex Fusion's Vector Testnet. Not realiable for older queries",
    network: 'afvt',
    isBuiltIn: true
  },
  {
    id: 'vector-mainnet',
    name: 'Vector Mainnet (Dolos)',
    type: 'dolos',
    description:
      "UTxORPC + MiniBlockfrost services for Apex Fusion's Vector Mainnet. Not realiable for older queries",
    network: 'afvm',
    isBuiltIn: true
  },
  {
    id: 'prime-testnet',
    name: 'Prime Testnet (Dolos)',
    type: 'dolos',
    description:
      "UTxORPC + MiniBlockfrost services for Apex Fusion's Prime Testnet. Not realiable for older queries",
    network: 'afpt',
    isBuiltIn: true
  },
  {
    id: 'prime-mainnet',
    name: 'Prime Mainnet (Dolos)',
    type: 'dolos',
    description:
      "UTxORPC + MiniBlockfrost services for Apex Fusion's Prime Mainnet. Not realiable for older queries",
    network: 'afpm',
    isBuiltIn: true
  }
];

export interface ProviderStore {
  currentProvider: ProviderConfig | null;
  customProviders: ProviderConfig[];
  allProviders: ProviderConfig[];
}
