// Non local providers do not have URLs or credentials exposed here
export type Network = 'preprod' | 'preview' | 'custom';

export const LOCAL_PROVIDER_ID = 'local-dolos';

export interface DolosConfig {
  id: string;
  name: string;
  description: string;
  type: 'dolos';
  network: Network;
  isLocal: boolean;
  isActive?: boolean;
  // Not set for built-in providers
  utxoRpcUrl?: string;
  utxoRpcApiKey?: string;
  miniBfUrl?: string;
  miniBfApiKey?: string;
}

export type ProviderConfig = DolosConfig;

export interface ProviderStore {
  currentProvider: ProviderConfig | null;
  allProviders: ProviderConfig[];
}
