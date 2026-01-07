// Non local providers do not have URLs or credentials exposed here
export type Network =
  | 'preprod'
  | 'preview'
  | 'mainnet'
  | 'devnet'
  | 'afvt'
  | 'afvm'
  | 'afpt'
  | 'afpm';

export const LOCAL_PROVIDER_ID = 'local-u5c';

export interface ProviderBase {
  id: string;
  name: string;
  description: string;
  network: Network;
  browser: boolean;
  isActive: boolean;
}

export interface U5CConfig extends ProviderBase {
  type: 'u5c';
  utxoRpcUrl: string;
  utxoRpcApiKey?: string;
}

export interface DbSyncConfig extends ProviderBase {
  type: 'dbsync';
  // TODO: add more connection details as needed (e.g., maxConnetions, timeouts, etc)
  connectionString: string;
}

export type ProviderConfig = U5CConfig | DbSyncConfig;

export function isU5CProvider(config: ProviderConfig): config is U5CConfig {
  return config.type === 'u5c';
}

export function isDbSyncProvider(config: ProviderConfig): config is DbSyncConfig {
  return config.type === 'dbsync';
}

export interface ProviderStore {
  currentProvider: ProviderConfig | null;
  allProviders: ProviderConfig[];
}
