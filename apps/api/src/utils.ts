import { Address, HexString, hexToBech32, isBase58 } from '@alexandria/types';
import { NetworkSchema } from './schemas/common';
import z from 'zod';

export function normalizeAddress(address: Address, prefix: string) {
  return isBase58(address) ? address : hexToBech32(HexString(address), prefix);
}

export function networkToAddrPrefix(network: z.infer<typeof NetworkSchema>): string {
  if (network === 'prime-testnet') {
    return 'addr_test';
  } else if (network === 'prime-mainnet') {
    return 'addr';
  } else if (network === 'vector-testnet') {
    return 'addr';
  } else if (network === 'vector-mainnet') {
    return 'addr';
  } else {
    return '';
  }
}
