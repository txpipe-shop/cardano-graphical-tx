import { Address, Hash, HexString } from './utxo-model';
import { Buffer } from 'buffer';

export function uint8ToHexString(arr: Uint8Array<ArrayBuffer>): HexString {
  return HexString(Buffer.from(arr).toString('hex'));
}

export function uint8ToHash(arr: Uint8Array<ArrayBuffer>): Hash {
  return Hash(Buffer.from(arr).toString('hex'));
}

export function uint8ToAddr(arr: Uint8Array<ArrayBuffer>): Address {
  return Address(Buffer.from(arr).toString('hex'));
}

export function diffValues<K extends string>(
  a: Record<K, bigint>,
  b: Record<K, bigint>
): Record<K, bigint> {
  const result = {} as Record<K, bigint>;
  const keys = new Set<K>();

  for (const key in a) keys.add(key as K);
  for (const key in b) keys.add(key as K);

  for (const key of keys) {
    const aVal: bigint = a[key] ?? 0n;
    const bVal: bigint = b[key] ?? 0n;
    const diff: bigint = aVal - bVal;

    if (diff !== 0n) {
      result[key] = diff;
    }
  }

  return result;
}
export function addManyValues<K extends string>(values: Record<K, bigint>[]): Record<K, bigint> {
  const result = {} as Record<K, bigint>;

  for (const record of values) {
    for (const [key, value] of Object.entries(record) as [K, bigint][]) {
      result[key] = (result[key] ?? 0n) + value;
    }
  }

  return result;
}
