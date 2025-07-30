import { cardano } from '@utxorpc/spec';
import { CardanoSyncClient } from '@utxorpc/sdk';
// TODO: move it somewhere where all types live happy together
export type Tx = {
  hash: string;
  fee: bigint;
  inputs: { txHash: string; index: number }[];
  outputs: { index: number; addr: string; coin: bigint }[];
};

function sourceToExplorerTx(tx: cardano.Tx): Tx {
  return {
    hash: Buffer.from(tx.hash).toString('hex'),
    inputs: tx.inputs.map((txIn) => ({
      index: txIn.outputIndex,
      txHash: Buffer.from(txIn.txHash).toString('hex')
    })),
    fee: tx.fee,
    outputs: tx.outputs.map((output, index) => ({
      index,
      addr: Buffer.from(output.address).toString('hex'),
      coin: output.coin
    }))
  };
}
export async function load() {
  const utxorpc = new CardanoSyncClient({
    uri: 'https://preprod.utxorpc-v0.demeter.run',
    headers: { 'dmtr-api-key': '' }
  });
  const block = await utxorpc.fetchBlock({
    hash: '4fe12e519dffca76937d21f09515758d7a06e9c55ed46305bfa528bf45d3d4e3',
    slot: 98223531
  });
  const utxoRpcTransactions = block.parsedBlock.body?.tx || [];
  const transactions: Tx[] = utxoRpcTransactions.map(sourceToExplorerTx);

  return { transactions, message: 'LOADED IN THE BACKEND ' };
}
