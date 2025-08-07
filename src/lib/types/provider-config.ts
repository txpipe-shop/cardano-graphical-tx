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

export interface ProviderStore {
  currentProvider: ProviderConfig | null;
  customProviders: ProviderConfig[];
  allProviders: ProviderConfig[];
}
