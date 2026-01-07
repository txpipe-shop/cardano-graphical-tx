import { getProviderById } from '@/providers/config';
import type { PageServerLoad } from './$types';
import { loadProviderServer } from '@/providers/load-server';

export const load: PageServerLoad = async ({ url }) => {
  const providerId = url.searchParams.get('provider');
  if (!providerId) {
    return { transactions: [], isServerLoaded: false };
  }

  const providerConfig = getProviderById(providerId);

  if (providerConfig && !providerConfig.browser) {
    try {
      const client = loadProviderServer(providerConfig);

      const latestTxs = await client.getTxs({
        limit: 20,
        query: undefined
      });

      const data = {
        transactions: latestTxs,
        isServerLoaded: true
      };

      return data;
    } catch (error) {
      console.error(error);
      return {
        transactions: [],
        isServerLoaded: true,
        error: `Error loading data from ${providerConfig.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  } else {
    return { transactions: [], isServerLoaded: false };
  }
};
