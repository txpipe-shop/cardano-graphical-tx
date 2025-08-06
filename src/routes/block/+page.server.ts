import { privateEnv } from '$lib/private-env';
import { DolosProvider } from '@/providers/cardano/dolos';
import { Hash } from '@/types/utxo-model';

export async function load() {
  const dolosProvider = new DolosProvider({
    utxoRpc: {
      uri: privateEnv.PREPROD_UTXORPC_URL,
      headers: {
        'dmtr-api-key': privateEnv.PREPROD_UTXORPC_API_KEY || ''
      }
    },
    miniBf: {
      uri: privateEnv.PREPROD_BLOCKFROST_URL,
      headers: {
        'dmtr-api-key': privateEnv.PREPROD_BLOCKFROST_API_KEY || ''
      }
    }
  });

  const { txs } = await dolosProvider.getBlock({
    hash: Hash('128370c277e68e6cfee4cae38c380f3fe13503acaf838891c3bbac2279e5b884')
  });

  return { transactions: txs };
}
