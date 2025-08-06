import { getServerProviderConfigs } from '@/server/provider-config';
import type { ProviderConfig } from '@/types/provider-config';

export async function load() {
  const serverConfigs = getServerProviderConfigs();

  // no secret in these providers
  const clientProviders: ProviderConfig[] = serverConfigs.map((config) => ({
    id: config.id,
    name: config.name,
    description: config.description,
    type: config.type,
    network: config.network,
    isBuiltIn: config.isBuiltIn
  }));

  return {
    providers: clientProviders,
    defaultProvider: clientProviders[0]
  };
}
