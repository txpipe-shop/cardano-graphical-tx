import { createProviderClient } from '@/client/provider-loader';
import { getProviderById } from '@/server/provider-config';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const providerId = url.searchParams.get('provider');
  if (!providerId) {
    return { transactions: [], isServerLoaded: false };
  }

  const providerConfig = getProviderById(providerId);

  if (!providerConfig?.isLocal && providerConfig) {
    try {
      const client = createProviderClient(providerConfig);

      const tx = await client.getLatestTx({ maxFetch: 100 });

      const latestTxs = await client.getTxs({
        before: tx.hash,
        limit: 100
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
