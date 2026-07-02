import { Buffer } from 'buffer';
import { MetadatumMap, type Metadata, type Metadatum } from '../../utxo-model.js';
import type { CIP25MetadataV1, CIPMetadataFile } from '../index.js';
import { getMdString, getMdStringOrArray, getMdValue, metadatumToUri } from './shared.js';

export function parseCip25(
  metadata: Metadata,
  policyId: string,
  assetName: string
): { metadata: CIP25MetadataV1; version: 1 | 2 } | null {
  const label721 = metadata.get(721n);
  if (!(label721 instanceof MetadatumMap)) return null;

  for (const [policyKey, assetMap] of label721) {
    const version = isV2Key(policyKey) ? 2 : 1;
    if (!matchesPolicy(policyKey, policyId)) continue;
    if (!(assetMap instanceof MetadatumMap)) continue;

    for (const [assetKey, innerMeta] of assetMap) {
      if (!matchesAsset(assetKey, assetName)) continue;
      const parsed = parseCip25MetadataDetails(innerMeta);
      if (parsed) return { metadata: parsed, version };
    }
  }

  return null;
}

export function parseCip25Files(map: MetadatumMap): CIPMetadataFile[] | undefined {
  const filesMd = getMdValue(map, 'files');
  if (filesMd === undefined || !Array.isArray(filesMd)) return undefined;

  const files: CIPMetadataFile[] = [];
  for (const fileMd of filesMd) {
    if (!(fileMd instanceof MetadatumMap)) continue;
    const name = getMdString(fileMd, 'name');
    const mediaType = getMdString(fileMd, 'mediaType');
    const src = getMdStringOrArray(fileMd, 'src');
    if (name && mediaType && src) {
      files.push({ name, mediaType, src });
    }
  }
  return files.length > 0 ? files : undefined;
}

function parseCip25MetadataDetails(metadatum: Metadatum): CIP25MetadataV1 | null {
  if (!(metadatum instanceof MetadatumMap)) return null;
  const map = metadatum;

  const name = getMdString(map, 'name');
  if (!name) return null;

  const imageMd = getMdValue(map, 'image');
  if (imageMd === undefined) return null;
  const image = metadatumToUri(imageMd);

  const result: CIP25MetadataV1 = { name, image };

  const mediaType = getMdString(map, 'mediaType');
  if (mediaType !== undefined) result.mediaType = mediaType;

  const description = getMdStringOrArray(map, 'description');
  if (description !== undefined) result.description = description;

  const files = parseCip25Files(map);
  if (files) result.files = files;

  return result;
}

function matchesPolicy(key: Metadatum, target: string): boolean {
  if (typeof key !== 'string') return false;
  return key === target;
}

function matchesAsset(key: Metadatum, targetHex: string): boolean {
  if (typeof key !== 'string') return false;
  if (isHexLike(key)) return key === targetHex;
  return key === Buffer.from(targetHex, 'hex').toString('utf8');
}

function isV2Key(key: Metadatum): boolean {
  return typeof key === 'string' && isHexLike(key);
}

function isHexLike(s: string): boolean {
  return s.length > 0 && /^[0-9a-fA-F]+$/.test(s);
}
