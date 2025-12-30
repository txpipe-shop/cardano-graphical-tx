import { TxContent, TxContentUtxo } from '@alexandria/blockfrost-sdk';

export type BfComprehensiveTx = {
  tx: TxContent;
  utxos: TxContentUtxo;
};

export interface CustomMatchers<R = unknown> {
  toEqualBfTx(expected: BfComprehensiveTx): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
