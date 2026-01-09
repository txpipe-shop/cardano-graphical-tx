import { bech32 } from 'bech32';
import { Address, Hash, HexString, Unit } from './utxo-model';
import { Buffer } from 'buffer';
import cip14 from '@emurgo/cip14-js';

export function uint8ToHexString(arr: Uint8Array<ArrayBuffer>): HexString {
  return HexString(Buffer.from(arr).toString('hex'));
}

export function uint8ToHash(arr: Uint8Array<ArrayBuffer>): Hash {
  return Hash(Buffer.from(arr).toString('hex'));
}

export function uint8ToAddr(arr: Uint8Array<ArrayBuffer>): Address {
  return Address(Buffer.from(arr).toString('hex'));
}

export function policyFromUnit(unit: Unit): HexString {
  return unit === 'lovelace' ? HexString('') : HexString(unit.slice(0, 56));
}

export function assetNameFromUnit(unit: Unit): HexString {
  return unit === 'lovelace' ? HexString('') : HexString(unit.slice(56));
}

export function fingerprintFromUnit(unit: Unit): string {
  return cip14
    .fromParts(
      Buffer.from(policyFromUnit(unit), 'hex'),
      Buffer.from(assetNameFromUnit(unit), 'hex')
    )
    .fingerprint();
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

export function bech32ToHex(bech32Address: string): HexString {
  // TODO: figure out what's a good limit here (200 seems OK for now)
  const { words } = bech32.decode(bech32Address, 200);
  const bytes = bech32.fromWords(words);
  return HexString(Buffer.from(bytes).toString('hex'));
}

export function hexToBech32(hex: HexString, prefix: string): string {
  const bytes = Buffer.from(hex, 'hex');
  const words = bech32.toWords(bytes);
  return bech32.encode(prefix, words, 200);
}

export function hexToAscii(hex: HexString): string {
  const bytes = Buffer.from(hex, 'hex');
  return bytes.toString('ascii');
}

export function isHexString(s: string): s is HexString {
  return /^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0;
}

export function isBase58(str: string): boolean {
  return /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(str);
}
