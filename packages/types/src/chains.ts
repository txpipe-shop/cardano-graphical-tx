import { type Tx as BaseTx, type UTxO as BaseUTxO, type Block as BaseBlock } from './utxo-model.js';
import { type Tx as CardanoTx, type UTxO as CardanoUTxO } from './cardano/index.js';

export type Cardano = BaseChain<CardanoUTxO, CardanoTx>;

export interface BaseChain<U extends BaseUTxO, T extends BaseTx<U>> {
  tx: T;
  block: BaseBlock<U, T>;
}
