import { Buffer } from 'buffer';
import type {
  CIP68MetadataFt333,
  CIP68MetadataMapV4,
  CIP68MetadataNft222,
  CIP68MetadataRft444,
  CIPMetadataFile
} from './types.js';

export const CIP68_PREFIX_REF = '000643b0';
export const CIP68_PREFIX_NFT = '000de140';
export const CIP68_PREFIX_FT = '0014df50';
export const CIP68_PREFIX_RFT = '001bc280';
export const CIP68_PREFIX_FT_NONSTANDARD = '0014df10';

type CIP68DirectResult = CIP68MetadataNft222 | CIP68MetadataFt333 | CIP68MetadataRft444;

type CIP68Result = CIP68DirectResult | CIP68MetadataMapV4;

export type Cip68DatumEnvelope = {
  constructor: number;
  fields: unknown[];
};

export function parseCip68(
  plutusJson: Record<string, unknown>
): { metadata: CIP68Result; version: number; isMapV4: boolean } | null {
  const envelope = plutusJson as unknown as Cip68DatumEnvelope;
  if (envelope.constructor !== 0 || !Array.isArray(envelope.fields)) return null;
  if (envelope.fields.length < 2) return null;

  const version = plutusInt(envelope.fields[1]);
  if (version === undefined) return null;

  const metadataField = envelope.fields[0] as Record<string, unknown> | undefined;
  if (!metadataField || metadataField.map === undefined) return null;

  const mapEntries = metadataField.map as Array<{ k: unknown; v: unknown }> | undefined;
  if (!Array.isArray(mapEntries)) return null;

  const isMapV4 = isCip68MapV4(mapEntries);
  if (isMapV4) {
    const metadata = parseCip68MapV4(mapEntries);
    if (!metadata) return null;
    return { metadata, version, isMapV4: true };
  }

  const metadata = version >= 3 ? parseCip68DirectV3(mapEntries) : parseCip68Direct(mapEntries);

  if (!metadata) return null;
  return { metadata, version, isMapV4: false };
}

function isCip68MapV4(entries: Array<{ k: unknown; v: unknown }>): boolean {
  for (const entry of entries) {
    const k = entry.k;
    if (typeof k === 'object' && k !== null && 'bytes' in (k as Record<string, unknown>)) {
      const bytes = (k as Record<string, unknown>).bytes as string;
      if (bytes === '373231') return true;
    }
  }
  return false;
}

function parseCip68MapV4(entries: Array<{ k: unknown; v: unknown }>): CIP68MetadataMapV4 | null {
  const result: Record<string, Record<string, CIP68DirectResult>> = {};
  for (const entry of entries) {
    const k = entry.k;
    if (typeof k !== 'object' || k === null) continue;
    const keyObj = k as Record<string, unknown>;
    if (keyObj.bytes !== '373231') continue;

    const innerMap = (entry.v as Record<string, unknown>)?.map as
      | Array<{ k: unknown; v: unknown }>
      | undefined;
    if (!Array.isArray(innerMap)) continue;

    for (const policyEntry of innerMap) {
      const policyK = policyEntry.k;
      if (typeof policyK !== 'object' || policyK === null) continue;
      const policyKeyObj = policyK as Record<string, unknown>;
      const policyId = policyKeyObj.bytes as string | undefined;
      if (!policyId) continue;

      const assetMap = (policyEntry.v as Record<string, unknown>)?.map as
        | Array<{ k: unknown; v: unknown }>
        | undefined;
      if (!Array.isArray(assetMap)) continue;
      if (!result[policyId]) result[policyId] = {};

      for (const assetEntry of assetMap) {
        const assetK = assetEntry.k;
        if (typeof assetK !== 'object' || assetK === null) continue;
        const assetKeyObj = assetK as Record<string, unknown>;
        const assetName = assetKeyObj.bytes as string | undefined;
        if (!assetName) continue;

        const metadataEntries = (assetEntry.v as Record<string, unknown>)?.map as
          | Array<{ k: unknown; v: unknown }>
          | undefined;
        if (!Array.isArray(metadataEntries)) continue;

        const parsed = parseCip68Direct(metadataEntries);
        if (parsed) result[policyId][assetName] = parsed;
      }
    }
  }
  if (Object.keys(result).length === 0) return null;
  return { '721': result } as unknown as CIP68MetadataMapV4;
}

function parseCip68Direct(
  entries: Array<{ k: unknown; v: unknown }>
): CIP68MetadataNft222 | CIP68MetadataFt333 | null {
  const name = decodePlutusBytes(entries.find((e) => plutusBytesValue(e.k) === '6e616d65')?.v);
  if (!name) return null;

  const description = decodePlutusBytes(
    entries.find((e) => plutusBytesValue(e.k) === '6465736372697074696f6e')?.v
  );

  const image = decodePlutusBytes(entries.find((e) => plutusBytesValue(e.k) === '696d616765')?.v);

  const mediaType = decodePlutusBytes(
    entries.find((e) => plutusBytesValue(e.k) === '6d6564696154797065')?.v
  );

  const ticker = decodePlutusBytes(
    entries.find((e) => plutusBytesValue(e.k) === '7469636b6572')?.v
  );

  const url = decodePlutusBytes(entries.find((e) => plutusBytesValue(e.k) === '75726c')?.v);

  const logo = decodePlutusBytes(entries.find((e) => plutusBytesValue(e.k) === '6c6f676f')?.v);

  const decimals = plutusInt(entries.find((e) => plutusBytesValue(e.k) === '646563696d616c73')?.v);

  if (image) {
    return {
      name,
      ...(description !== undefined && { description }),
      image,
      ...(mediaType !== undefined && { mediaType })
    } as CIP68MetadataNft222;
  }

  return {
    name,
    ...(description !== undefined && { description }),
    ...(ticker !== undefined && { ticker }),
    ...(url !== undefined && { url }),
    ...(logo !== undefined && { logo }),
    ...(decimals !== undefined && { decimals })
  } as CIP68MetadataFt333;
}

function parseCip68DirectV3(entries: Array<{ k: unknown; v: unknown }>): CIP68DirectResult | null {
  const name = decodePlutusBytes(entries.find((e) => plutusBytesValue(e.k) === '6e616d65')?.v);
  if (!name) return null;

  const description = decodePlutusBytesOrArray(
    entries.find((e) => plutusBytesValue(e.k) === '6465736372697074696f6e')?.v
  );

  const image = decodePlutusBytesOrArray(
    entries.find((e) => plutusBytesValue(e.k) === '696d616765')?.v
  );

  const mediaType = decodePlutusBytes(
    entries.find((e) => plutusBytesValue(e.k) === '6d6564696154797065')?.v
  );

  const ticker = decodePlutusBytes(
    entries.find((e) => plutusBytesValue(e.k) === '7469636b6572')?.v
  );

  const url = decodePlutusBytes(entries.find((e) => plutusBytesValue(e.k) === '75726c')?.v);

  const logo = decodePlutusBytesOrArray(
    entries.find((e) => plutusBytesValue(e.k) === '6c6f676f')?.v
  );

  const decimals = plutusInt(entries.find((e) => plutusBytesValue(e.k) === '646563696d616c73')?.v);

  const files = parseCip68Files(entries);

  if (image && decimals !== undefined) {
    return {
      name,
      ...(description !== undefined && { description }),
      image,
      ...(mediaType !== undefined && { mediaType }),
      decimals,
      ...(files && { files })
    } as CIP68MetadataRft444;
  }

  if (image) {
    return {
      name,
      ...(description !== undefined && { description }),
      image,
      ...(mediaType !== undefined && { mediaType }),
      ...(files && { files })
    } as CIP68MetadataNft222;
  }

  return {
    name,
    ...(description !== undefined && { description }),
    ...(ticker !== undefined && { ticker }),
    ...(url !== undefined && { url }),
    ...(logo !== undefined && { logo }),
    ...(decimals !== undefined && { decimals })
  } as CIP68MetadataFt333;
}

function parseCip68Files(
  entries: Array<{ k: unknown; v: unknown }>
): CIPMetadataFile[] | undefined {
  const filesEntry = entries.find((e) => plutusBytesValue(e.k) === '66696c6573');
  if (!filesEntry || !Array.isArray(filesEntry.v)) return undefined;
  const files: CIPMetadataFile[] = [];
  for (const fileItem of filesEntry.v) {
    const fileMap = (fileItem as Record<string, unknown>)?.map as
      | Array<{ k: unknown; v: unknown }>
      | undefined;
    if (!Array.isArray(fileMap)) continue;
    const name = decodePlutusBytes(fileMap.find((e) => plutusBytesValue(e.k) === '6e616d65')?.v);
    const mediaType = decodePlutusBytes(
      fileMap.find((e) => plutusBytesValue(e.k) === '6d6564696154797065')?.v
    );
    const src = decodePlutusBytesOrArray(
      fileMap.find((e) => plutusBytesValue(e.k) === '737263')?.v
    );
    if (name && mediaType && src) {
      files.push({ name, mediaType, src });
    }
  }
  return files.length > 0 ? files : undefined;
}

function plutusBytesValue(val: unknown): string | undefined {
  if (typeof val === 'object' && val !== null && 'bytes' in (val as Record<string, unknown>)) {
    return (val as Record<string, unknown>).bytes as string;
  }
  if (typeof val === 'object' && val !== null && 'int' in (val as Record<string, unknown>)) {
    return String((val as Record<string, unknown>).int);
  }
  return undefined;
}

function plutusInt(val: unknown): number | undefined {
  if (typeof val === 'object' && val !== null && 'int' in (val as Record<string, unknown>)) {
    return Number((val as Record<string, unknown>).int);
  }
  return undefined;
}

function decodePlutusBytes(val: unknown): string | undefined {
  if (typeof val === 'object' && val !== null && 'bytes' in (val as Record<string, unknown>)) {
    try {
      return Buffer.from((val as Record<string, unknown>).bytes as string, 'hex').toString('utf8');
    } catch {
      return undefined;
    }
  }
  if (typeof val === 'string') return val;
  return undefined;
}

function decodePlutusBytesOrArray(val: unknown): string | string[] | undefined {
  if (Array.isArray(val)) {
    const parts = val.map((v) => {
      if (typeof v === 'object' && v !== null && 'bytes' in (v as Record<string, unknown>)) {
        try {
          return Buffer.from((v as Record<string, unknown>).bytes as string, 'hex').toString(
            'utf8'
          );
        } catch {
          return undefined;
        }
      }
      return undefined;
    });
    const filtered = parts.filter((p): p is string => p !== undefined);
    return filtered.length > 0 ? filtered : undefined;
  }
  return decodePlutusBytes(val);
}
