import { getProviderById } from '@/server/provider-config';
import type { PageServerLoad } from './$types';
import { Hash } from '@/types/utxo-model';
import { createProviderClient } from '@/client/provider-loader';

export const load: PageServerLoad = async ({ url }) => {
  const providerId = url.searchParams.get('provider') || 'preprod-dolos';

  const providerConfig = getProviderById(providerId);

  if (providerConfig?.isBuiltIn) {
    try {
      const client = createProviderClient(providerConfig);

      const { txs } = await client.getBlock({
        hash: Hash('8815bd746347f6cd344eda4a8c138ff93a9e1a520d08519eed83a107ec5b3cd5')
      });

      const data = {
        transactions: txs,
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
