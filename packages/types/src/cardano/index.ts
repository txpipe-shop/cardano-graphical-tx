import {
  type Block as BaseBlock,
  type Tx as BaseTx,
  type UTxO as BaseUTxO,
  HexString,
  Unit
} from '../utxo-model.js';

export * from './utils.js';
export * from './metadata/index.js';

export enum RdmrPurpose {
  Spend = 'spend',
  Mint = 'mint',
  Cert = 'cert',
  Reward = 'reward',
  Vote = 'vote',
  Purpose = 'purpose',
  Unspecified = 'unspecified'
}

export type Redeemer = {
  index: number;
  purpose: RdmrPurpose;
  scriptHash: HexString;
  redeemerDataHash: HexString;
  unitMem: bigint;
  unitSteps: bigint;
  fee: bigint;
};

export enum ScriptType {
  Native = 'native',
  PlutusV1 = 'plutusV1',
  PlutusV2 = 'plutusV2',
  PlutusV3 = 'plutusV3'
}

export type Script = {
  type?: ScriptType;
  bytes?: HexString;
  hash?: HexString;
};

/**
 * Cardano specific transaction properties
 */
export type CardanoTxFields = {
  treasuryDonation?: bigint;
  createdAt?: number;
  witnesses?: { redeemers?: Redeemer[]; scripts?: Script[] };
  validityInterval?: { invalidBefore?: bigint; invalidHereafter?: bigint };
  indexInBlock: bigint;
};

export type CardanoBlockFields = { epochNo: bigint };

export type UTxO = BaseUTxO & { referenceScript?: Script };
export type Tx = BaseTx<UTxO> & CardanoTxFields;
export type Block = BaseBlock<UTxO, Tx> & CardanoBlockFields;

// Token Metadata shapes
export type CIPMetadataFile = {
  name: string;
  mediaType: string;
  src: string | string[];
};

export type CIP25MetadataV1 = {
  name: string;
  image: string | string[];
  mediaType?: string;
  description?: string | string[];
  files?: CIPMetadataFile[];
};

export type CIP25MetadataV2 = CIP25MetadataV1;

export type CIP26Signature = {
  signature: HexString;
  publicKey: HexString;
};

export type CIP26MetadataEntry = {
  value: string;
  sequenceNumber: number;
  signatures?: CIP26Signature[];
};

export type CIP26Preimage = {
  alg: 'sha1' | 'sha' | 'sha3' | 'blake2b' | 'blake2s' | 'keccak' | 'md5';
  msg: HexString;
};

export type CIP26Metadata = {
  subject: Unit;
  policy?: HexString;
  preimage?: CIP26MetadataEntry;
  name?: CIP26MetadataEntry;
  description?: CIP26MetadataEntry;
  ticker?: CIP26MetadataEntry;
  decimals?: CIP26MetadataEntry;
  url?: CIP26MetadataEntry;
  logo?: CIP26MetadataEntry;
};

// CIP-68
export type CIP68MetadataNft222 = {
  name: string;
  image: string | string[];
  mediaType?: string;
  description?: string | string[];
  files?: CIPMetadataFile[];
};

export type CIP68MetadataFt333 = {
  name: string;
  description: string;
  ticker?: string;
  url?: string;
  logo?: string | string[];
  decimals?: number;
};

export type CIP68MetadataRft444 = {
  name: string;
  image: string | string[];
  mediaType?: string;
  description?: string | string[];
  decimals?: number;
  files?: CIPMetadataFile[];
};

export type CIP68MetadataMapV4 = {
  '721': Record<
    string,
    Record<string, CIP68MetadataNft222 | CIP68MetadataFt333 | CIP68MetadataRft444>
  >;
};

export type TokenMetadata = {
  Cip25v1: CIP25MetadataV1;
  Cip25v2: CIP25MetadataV2;
  Cip26: CIP26Metadata;
  Cip68v1: CIP68MetadataNft222 | CIP68MetadataFt333;
  Cip68v2: CIP68MetadataNft222 | CIP68MetadataFt333;
  Cip68v3: CIP68MetadataNft222 | CIP68MetadataFt333 | CIP68MetadataRft444;
  Cip68v4: CIP68MetadataNft222 | CIP68MetadataFt333 | CIP68MetadataRft444 | CIP68MetadataMapV4;
};

export type NullableTokenMetadata = {
  [K in keyof TokenMetadata]: TokenMetadata[K] | null;
};
