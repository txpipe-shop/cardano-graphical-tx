import { Hash } from '@laceanatomy/types';
import type { PageServerLoad } from './$types';
import { getProviderById } from '@/providers/config';
import { loadProviderServer } from '@/providers/load-server';

export const load: PageServerLoad = async ({ url, params }) => {
  const providerId = url.searchParams.get('provider');
  const datumTab = url.searchParams.get('datumTab');
  if (!providerId || !params.hash) {
    return { tx: null, isServerLoaded: false, datumTab };
  }
  const providerConfig = getProviderById(providerId);

  if (!providerConfig?.browser && providerConfig) {
    try {
      const client = loadProviderServer(providerConfig);
      const tx = await client.getTx({ hash: Hash(params.hash) });
      let cbor = null;
      try {
        cbor = await client.getCBOR({ hash: Hash(params.hash) });
      } catch {
        return {
          tx,
          cbor,
          isServerLoaded: true,
          error: 'CBOR not available from this provider',
          datumTab
        };
      }
      return { tx, cbor, isServerLoaded: true, datumTab };
    } catch (error) {
      return {
        tx: null,
        cbor: null,
        isServerLoaded: true,
        error: `Error loading tx from ${providerConfig.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        datumTab
      };
    }
  }

  return { tx: null, isServerLoaded: false, datumTab };
};
