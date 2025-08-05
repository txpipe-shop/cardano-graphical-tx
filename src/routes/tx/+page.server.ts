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

  return await dolosProvider.getBlock({
    hash: Hash('7be418ff7622bd75028d80c0f02392307eb5bab56cc4af696b91aef4675f91f0')
  });
}
