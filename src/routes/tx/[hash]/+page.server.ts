import { getProviderById } from '@/server/provider-config';
import type { PageServerLoad } from './$types';
import { createProviderClient } from '@/client/provider-loader';
import { Hash } from '@/types/utxo-model';

export const load: PageServerLoad = async ({ url, params }) => {
  const providerId = url.searchParams.get('provider') || 'preprod-dolos';
  const providerConfig = getProviderById(providerId);

  if (providerConfig?.isBuiltIn) {
    try {
  const client = createProviderClient(providerConfig);
  const tx = await client.getTx({ hash: Hash(params.hash) });
      return { tx, isServerLoaded: true };
    } catch (error) {
      return {
        tx: null,
        isServerLoaded: true,
        error: `Error loading tx from ${providerConfig.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  return { tx: null, isServerLoaded: false };
};
