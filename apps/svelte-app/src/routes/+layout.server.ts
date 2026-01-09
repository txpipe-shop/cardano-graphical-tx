import { getClientProviders } from '@/providers/config';

export async function load() {
  const clientProviders = getClientProviders();

  return { providers: clientProviders };
}
