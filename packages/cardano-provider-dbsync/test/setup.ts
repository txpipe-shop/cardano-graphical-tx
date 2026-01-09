import 'dotenv/config';
import { BlockContent, EpochContent, TxContent, TxContentUtxo } from '@alexandria/blockfrost-sdk';
import z from 'zod';

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
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

export const testEnv = z.object({
  DB_CONNECTION_STRING: z.url(),
  BF_URL: z.url()
});

export type TestEnv = z.infer<typeof testEnv>;
