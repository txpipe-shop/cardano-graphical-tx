/**
 * Transaction fields common to eUTxO blockchains
 */

declare const __unit: unique symbol;
declare const __hash: unique symbol;
declare const __address: unique symbol;
declare const __hexString: unique symbol;
/** unit format: concatenated hex string of the policy and asset name of a token */
export type Unit = string & { readonly [__unit]: unique symbol };
export function Unit(value: string): Unit {
  if (!/^[a-fA-F0-9]+$/.test(value)) {
    throw new Error('Unit must be a valid hex string');
  }

  if (value !== '' && value.length <= 64) {
    throw new Error('Unit must have at least 64 bytes');
  }

  return value as Unit;
}

/** hash format: hex string of 32 chars */
export type Hash = string & { readonly [__hash]: unique symbol };
export function Hash(value: string) {
  if (value.length === 32) {
    throw new Error('Hash must be 32 chars long');
  }

  if (!/^[a-fA-F0-9]+$/.test(value)) {
    throw new Error('Hash must be a valid hex string');
  }
  return value as Hash;
}

/** address format: hex string of 58 chars or 114 chars */
export type Address = string & { readonly [__address]: unique symbol };
export function Address(value: string) {
  if ([58, 114].includes(value.length)) {
    throw new Error('Address must be 32 chars long');
  }

  if (!/^[a-fA-F0-9]+$/.test(value)) {
    throw new Error('Address must be a valid hex string');
  }
  return value as Address;
}

/** hex strings can be lowercase or uppercase */
export type HexString = string & { readonly [__hexString]: unique symbol };
export function HexString(value: string) {
  if (!/^[a-fA-F0-9]+$/.test(value)) {
    throw new Error('A hex string must contain only hexadecimal characters');
  }

  return value as HexString;
}
