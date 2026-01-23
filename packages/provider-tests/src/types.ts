import { BlockContent, EpochContent, TxContent, TxContentUtxo } from '@laceanatomy/blockfrost-sdk';

import 'vitest';

export type BfComprehensiveTx = {
    tx: TxContent;
    utxos: TxContentUtxo;
};

export interface CustomMatchers<R = unknown> {
    toEqualBfTx(expected: BfComprehensiveTx): R;
    toEqualBfBlock(expected: BlockContent): R;
    toEqualBfEpoch(expected: EpochContent): R;
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> { }
    interface AsymmetricMatchersContaining extends CustomMatchers { }
}
