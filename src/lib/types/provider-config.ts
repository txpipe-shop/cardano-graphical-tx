// Builtin providers do not have URLs or credentials exposed here

export type Network = 'preprod' | 'preview' | 'custom';

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

export type ProviderConfig = DolosConfig;

export interface ProviderStore {
  currentProvider: ProviderConfig | null;
  customProviders: ProviderConfig[];
  allProviders: ProviderConfig[];
}
