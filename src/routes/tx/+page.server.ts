import { privateEnv } from '$lib/private-env';
import { DolosProvider } from '@/providers/cardano/dolos';
import { Hash } from '@/types/utxo-model';

export async function load() {
  const dolosProvider = new DolosProvider({
    utxoRpc: {
      uri: privateEnv.UTXORPC_URL,
      headers: {
        'dmtr-api-key': privateEnv.UTXORPC_API_KEY || ''
      }
    },
    miniBf: {
      uri: privateEnv.BLOCKFROST_URL
    }
  });

  const { txs } = await dolosProvider.getBlock({
    hash: Hash('549e04a560d569a284d4789a04df3fd46f7388e011e6dab1a18f683805d3bd11')
  });

  return { transactions: txs, message: 'LOADED IN THE BACKEND ' };
}
