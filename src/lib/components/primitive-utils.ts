import { hexToAscii, hexToBech32 } from '@/types/cardano/utils';
import { HexString, type Hash } from '@/types/utxo-model';

export function truncHash(hash: Hash): string {
  return hash;
}

export function trunc(str: string, length = 20): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...${str.slice(-length)}`;
}

export function formatDate(s?: number) {
  if (!s) return '-';
  try {
    return new Date(s * 1000).toLocaleString();
  } catch {
    return '-';
  }
}

export function getAssetName(policyAndName: string) {
  if (policyAndName.length <= 56) return `(${policyAndName})`;
  const nameHex = policyAndName.slice(56);
  let name = '';
  try {
    name = trunc(hexToAscii(HexString(nameHex)), 20);
    if (!name || name.trim() === '') name = '(empty)';
  } catch {
    name = trunc(nameHex, 20);
  }
  return `${name}`;
}

export function formatAddress(address: string, truncate: boolean = true, length: number = 30) {
  if (!address) return 'No address found';
  try {
    // The prefix will change depending on the network
    return truncate
      ? trunc(hexToBech32(HexString(address), 'addr_test'), length)
      : hexToBech32(HexString(address), 'addr_test');
  } catch {
    return trunc(address);
  }
}
