import { BlockContent } from '@laceanatomy/blockfrost-sdk';
import { BlockRes } from '@laceanatomy/provider-core';

export function toEqualBfBlock(
  received: BlockRes,
  expected: BlockContent
): { pass: boolean; message: () => string } {
  const failures: string[] = [];

  if (received.hash !== expected.hash) {
    failures.push(`hash: expected ${expected.hash}, received ${received.hash}`);
  }

  if (expected.height !== null && received.height !== BigInt(expected.height)) {
    failures.push(`height: expected ${expected.height}, received ${received.height}`);
  }

  if (expected.slot !== null && received.slot !== BigInt(expected.slot)) {
    failures.push(`slot: expected ${expected.slot}, received ${received.slot}`);
  }

  if (expected.fees !== null && received.fees !== BigInt(expected.fees || '0')) {
    failures.push(`fees: expected ${expected.fees}, received ${received.fees}`);
  }

  if (received.txCount !== BigInt(expected.tx_count)) {
    failures.push(`txCount: expected ${expected.tx_count}, received ${received.txCount}`);
  }

  const pass = failures.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? 'Expected block values not to be equal'
        : `Block mismatch for ${expected.hash}:\n${failures.join('\n')}`
  };
}
