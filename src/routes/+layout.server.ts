import { getClientProviderConfigs } from '@/server/provider-config';

export async function load() {
  const clientProviders = getClientProviderConfigs();

  return {
    providers: clientProviders,
    defaultProvider: clientProviders[0]
  };
}
