import { getClientProviders } from '@/server/provider-config';

export async function load() {
  const clientProviders = getClientProviders();

  return { providers: clientProviders };
}
