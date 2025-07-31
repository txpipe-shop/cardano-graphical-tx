import { type Tx as BaseTx, type Block as BaseBlock } from './utxo-model';
import { type Tx as CardanoTx, type Block as CardanoBlock } from './cardano';

export type Cardano = {
  tx: CardanoTx;
  block: CardanoBlock;
  // TODO: maybe add protocol parameters here
};

export interface BaseChain {
  tx: BaseTx;
  block: BaseBlock;
}
