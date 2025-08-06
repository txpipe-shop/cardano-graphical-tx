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
        hash: Hash('92ad00fe7f273e577c0cc5987caed3f662a05a330eeeec255d34b2accb016419')
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
