import { getProviderById } from '@/server/provider-config';
import type { PageServerLoad } from './$types';
import { createProviderClient } from '@/client/provider-loader';

export const load: PageServerLoad = async ({ url }) => {
  const providerId = url.searchParams.get('provider');
  if (!providerId) {
    return {
      transactions: [],
      isServerLoaded: false
    };
  }

  const providerConfig = getProviderById(providerId);

  if (providerConfig?.isBuiltIn) {
    try {
      const client = createProviderClient(providerConfig);

      const tx = await client.getLatestTx();

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
      return {
        transactions: [],
        isServerLoaded: true,
        error: `Error loading data from ${providerConfig.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  } else {
    return {
      transactions: [],
      isServerLoaded: false
    };
  }
};
