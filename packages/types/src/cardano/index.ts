import {
  type Block as BaseBlock,
  type Tx as BaseTx,
  type UTxO as BaseUTxO,
  HexString,
  Unit
} from '../utxo-model.js';

export * from './utils.js';

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
export type CIP25File = {
  name: string;
  mediaType: string;
  src: string | string[];
};

export type CIP25MetadataV1 = {
  name: string;
  image: string | string[];
  mediaType?: string;
  description?: string | string[];
  files?: CIP25File[];
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

// CIP-60 v1 (deprecated)
export type CIP60V1Artist = {
  name: string;
  image?: string | string[];
};

export type CIP60V1SongFields = {
  artists?: CIP60V1Artist[];
  album_title?: string;
  track_number?: number;
  song_title?: string | string[];
  song_duration?: string;
  genres?: string[];
  copyright?: string;
  contributing_artists?: CIP60V1Artist[];
  series?: string;
  collection?: string;
  set?: string;
  mood?: string;
  lyrics?: string;
  lyricists?: string[];
  special_thanks?: string[];
  visual_artist?: string;
  distributor?: string;
  release_date?: string;
  publication_date?: string;
  catalog_number?: number;
  bitrate?: string;
  mix_engineer?: string;
  mastering_engineer?: string;
  producer?: string;
  co_producer?: string;
  featured_artist?: CIP60V1Artist;
  recording_engineer?: string;
  release_version?: number;
  parental_advisory?: string;
  explicit?: boolean;
  isrc?: string;
  iswc?: string;
  ipi?: string[];
  ipn?: string[];
  isni?: string[];
  metadata_language?: string;
  country_of_origin?: string;
  language?: string;
  derived_from?: string;
  links?: Record<string, string | string[]>;
};

export type CIP60V1File = {
  name: string;
  mediaType: string;
  src: string | string[];
} & CIP60V1SongFields;

export type CIP60MetadataV1 = {
  name: string;
  image: string | string[];
  music_metadata_version: 1;
  release_type: 'Single' | 'Multiple';
  files?: CIP60V1File[];
  version?: 1 | 2;
  mediaType?: string;
  description?: string | string[];
} & CIP60V1SongFields;

// CIP-60 v2 (deprecated)
export type CIP60V2Artist = {
  name: string;
  image?: string | string[];
};

export type CIP60V2Release = {
  release_title?: string;
  copyright?: string;
  visual_artist?: string;
  distributor?: string;
  release_date?: string;
  publication_date?: string;
  catalog_number?: number;
  release_version?: number;
  producer?: string;
  co_producer?: string;
  metadata_language?: string;
  country_of_origin?: string;
  language?: string;
  links?: Record<string, string | string[]>;
};

export type CIP60V2Song = {
  artists?: CIP60V2Artist[];
  track_number?: number;
  song_title?: string | string[];
  song_duration?: string;
  genres?: string[];
  copyright?: string;
  contributing_artists?: CIP60V2Artist[];
  series?: string;
  collection?: string;
  set?: string;
  mood?: string;
  lyrics?: string;
  lyricists?: string[];
  special_thanks?: string[];
  visual_artist?: string;
  distributor?: string;
  release_date?: string;
  publication_date?: string;
  catalog_number?: number;
  bitrate?: string;
  bpm?: string;
  mix_engineer?: string;
  mastering_engineer?: string;
  producer?: string;
  co_producer?: string;
  featured_artist?: CIP60V2Artist;
  recording_engineer?: string;
  release_version?: number;
  parental_advisory?: string;
  explicit?: boolean;
  isrc?: string;
  iswc?: string;
  ipi?: string[];
  ipn?: string[];
  isni?: string[];
  metadata_language?: string;
  country_of_origin?: string;
  language?: string;
  derived_from?: string;
  links?: Record<string, string | string[]>;
};

export type CIP60V2File = {
  name: string;
  mediaType: string;
  src: string | string[];
  song: CIP60V2Song;
};

export type CIP60MetadataV2 = {
  name: string;
  image: string | string[];
  music_metadata_version: 2;
  release_type: 'Single' | 'Multiple';
  release: CIP60V2Release;
  files?: CIP60V2File[];
  version?: 1 | 2;
  mediaType?: string;
  description?: string | string[];
};

// CIP-60 v3
export type CIP60V3Artist = {
  name: string;
  isni?: string;
  links?: Record<string, string>;
};

export type CIP60V3Author = {
  name: string;
  ipi?: string;
  share?: string;
};

export type CIP60V3ContributingArtist = {
  name: string;
  ipn?: string;
  ipi?: string;
  role?: string[];
  links?: Record<string, string>;
};

export type CIP60V3Copyright = {
  master: string;
  composition: string;
};

export type CIP60V3Release = {
  release_type: 'Single' | 'Multiple' | 'Album/EP';
  release_title: string;
  artists?: CIP60V3Artist[];
  genres?: string[];
  copyright?: CIP60V3Copyright;
  contributing_artists?: CIP60V3ContributingArtist[];
  distributor?: string;
  visual_artist?: string;
  release_date?: string;
  publication_date?: string;
  catalog_number?: string;
  series?: string;
  collection?: string;
};

export type CIP60V3Song = {
  song_title: string | string[];
  song_duration: string;
  track_number: number;
  artists?: CIP60V3Artist[];
  genres?: string[];
  copyright?: CIP60V3Copyright;
  contributing_artists?: CIP60V3ContributingArtist[];
  featured_artists?: CIP60V3Artist[];
  authors?: CIP60V3Author[];
  mood?: string;
  set?: string;
  lyrics?: string;
  special_thanks?: string[];
  bitrate?: string;
  bpm?: string;
  mix_engineer?: string;
  mastering_engineer?: string;
  producer?: string;
  co_producer?: string;
  recording_engineer?: string;
  explicit?: boolean;
  isrc?: string;
  iswc?: string;
  metadata_language?: string;
  country_of_origin?: string;
  language?: string;
  derived_from?: string;
  ai_generated?: boolean;
};

export type CIP60V3File = {
  name: string;
  mediaType: string;
  src: string;
  song: CIP60V3Song;
};

export type CIP60MetadataV3 = {
  name: string;
  image: string;
  music_metadata_version: 3;
  release: CIP60V3Release;
  files: [CIP60V3File, ...CIP60V3File[]];
  version?: 1 | 2;
  mediaType?: string;
  description?: string | string[];
};

export type TokenMetadata = {
  Cip25v1: CIP25MetadataV1;
  Cip25v2: CIP25MetadataV2;
  Cip26: CIP26Metadata;
  Cip60v1: CIP60MetadataV1;
  Cip60v2: CIP60MetadataV2;
  Cip60v3: CIP60MetadataV3;
};


