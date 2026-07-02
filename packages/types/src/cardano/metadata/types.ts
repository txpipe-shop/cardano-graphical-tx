import { type HexString, type Unit } from '../../utxo-model.js';

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

export type CIP26Metadata = {
  subject: Unit;
  policy?: HexString;
  name?: string;
  description?: string;
  ticker?: string;
  decimals?: number;
  url?: string;
  logo?: string;
};

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
