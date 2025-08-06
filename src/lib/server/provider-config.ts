import { privateEnv } from '@/private-env';
import type { ProviderConfig } from '@/types/provider-config';

export function getServerProviderConfigs(): ProviderConfig[] {
  return [
    {
      id: 'preprod-dolos',
      name: 'Preprod (Dolos)',
      description: '',
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
      description: '',
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
      description: '',
      miniBfUrl: privateEnv.PREVIEW_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.PREVIEW_BLOCKFROST_API_KEY,
      utxoRpcUrl: privateEnv.PREVIEW_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.PREVIEW_UTXORPC_API_KEY,
      type: 'dolos',
      network: 'preview',
      isBuiltIn: true
    },
    {
      id: 'vector-mainnet-dolos',
      name: 'Vector Mainnet (Dolos)',
      description: '',
      miniBfUrl: privateEnv.AF_VECTOR_MAINNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_VECTOR_MAINNET_BLOCKFROST_API_KEY,
      utxoRpcUrl: privateEnv.AF_VECTOR_MAINNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_VECTOR_MAINNET_UTXORPC_API_KEY,
      type: 'dolos',
      network: 'afvm',
      isBuiltIn: true
    },
    {
      id: 'vector-testnet-dolos',
      name: 'Vector Testnet (Dolos)',
      description: '',
      utxoRpcUrl: privateEnv.AF_VECTOR_TESTNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_VECTOR_TESTNET_UTXORPC_API_KEY,
      miniBfUrl: privateEnv.AF_VECTOR_TESTNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_VECTOR_TESTNET_BLOCKFROST_API_KEY,
      type: 'dolos',
      network: 'afvt',
      isBuiltIn: true
    },
    {
      id: 'prime-mainnet-dolos',
      name: 'Prime Mainnet (Dolos)',
      description: '',
      utxoRpcUrl: privateEnv.AF_PRIME_MAINNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_PRIME_MAINNET_UTXORPC_API_KEY,
      miniBfUrl: privateEnv.AF_PRIME_MAINNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_PRIME_MAINNET_BLOCKFROST_API_KEY,
      type: 'dolos',
      network: 'custom',
      isBuiltIn: true
    },
    {
      id: 'prime-testnet-dolos',
      name: 'Prime Testnet (Dolos)',
      description: '',
      utxoRpcUrl: privateEnv.AF_PRIME_TESTNET_UTXORPC_URL,
      utxoRpcApiKey: privateEnv.AF_PRIME_TESTNET_UTXORPC_API_KEY,
      miniBfUrl: privateEnv.AF_PRIME_TESTNET_BLOCKFROST_URL,
      miniBfApiKey: privateEnv.AF_PRIME_TESTNET_BLOCKFROST_API_KEY,
      type: 'dolos',
      network: 'custom',
      isBuiltIn: true
    }
  ];
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
