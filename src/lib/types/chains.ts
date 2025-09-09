import { type Tx as BaseTx, type UTxO as BaseUTxO, type Block as BaseBlock } from './utxo-model';
import { type Tx as CardanoTx, type UTxO as CardanoUTxO } from './cardano/cardano';

export type Cardano = BaseChain<CardanoUTxO, CardanoTx>;

export interface BaseChain<U extends BaseUTxO, T extends BaseTx<U>> {
  tx: T;
  block: BaseBlock<U, T>;
}
