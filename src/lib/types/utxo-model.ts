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
  const hashLength = 32;
  if (value.length === hashLength) {
    throw new Error(`Hash must be ${hashLength} chars long`);
  }

  if (!/^[a-fA-F0-9]+$/.test(value)) {
    throw new Error('Hash must be a valid hex string');
  }
  return value as Hash;
}

/** address format: hex string of 58 chars or 114 chars */
export type Address = string & { readonly [__address]: unique symbol };
export function Address(value: string) {
  const addrLength = [58, 114];
  if (!addrLength.includes(value.length)) {
    throw new Error(`Address must be ${addrLength.join(' or ')} chars long`);
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

export type Value = Record<Unit, bigint>;

export type OutRef = {
  hash: Hash;
  index: bigint;
};

export enum DatumType {
  HASH = 0,
  INLINE = 1
}

export type Datum =
  | { type: DatumType.HASH; datumHashHex: Hash }
  | { type: DatumType.INLINE; datumHex: HexString };

export type UTxO = {
  outRef: OutRef;
  address: Address;
  coin: bigint;
  value: Value;
  datum?: Datum;
  consumedBy?: Hash;
};

export type MetadatumMap = Map<Metadatum, Metadatum>;
export const MetadatumMap = Map<Metadatum, Metadatum>;
export type Metadatum = bigint | MetadatumMap | string | HexString | Metadatum[];
export type Metadata = Map<bigint, Metadatum>;

export type Mint = Value;

export type Tx<T extends UTxO> = {
  hash: Hash;
  fee: bigint;
  mint: Mint;
  outputs: T[];
  inputs: T[];
  referenceInputs: T[];
  metadata?: Metadata;
};

export type ChainPoint = {
  hash: Hash;
  slot: bigint;
};

export type BlockHeader = {
  chainPoint: ChainPoint;
  blockNumber: bigint;
  previousHash?: Hash;
};

export type Block<U extends UTxO, T extends Tx<U>> = {
  header: BlockHeader;
  txs: T[];
};
