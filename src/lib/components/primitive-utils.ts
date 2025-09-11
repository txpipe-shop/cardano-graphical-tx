import type { Hash } from '@/types/utxo-model';

export function truncHash(hash: Hash): string {
  return hash;
}

export function trunc(str: string, length = 20): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...${str.slice(-length)}`;
}
