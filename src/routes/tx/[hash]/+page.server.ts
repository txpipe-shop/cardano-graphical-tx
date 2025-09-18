import { createProviderClient } from '@/client/provider-loader';
import { getProviderById } from '@/server/provider-config';
import { Hash } from '@/types/utxo-model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, params }) => {
  const providerId = url.searchParams.get('provider');
  if (!providerId || !params.hash) {
    return {
      tx: null,
      isServerLoaded: false
    };
  }
  const providerConfig = getProviderById(providerId);

  if (providerConfig && !providerConfig?.isLocal) {
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
