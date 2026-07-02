import { Buffer } from 'buffer';
import { HexString, MetadatumMap, type Metadatum } from '../../utxo-model.js';

export function hexKey(key: string): HexString {
  return HexString(Buffer.from(key, 'utf8').toString('hex'));
}

export function getMdValue(map: MetadatumMap, key: string): Metadatum | undefined {
  return map.get(key) ?? map.get(hexKey(key));
}

export function getMdString(map: MetadatumMap, key: string): string | undefined {
  const val = getMdValue(map, key);
  if (val === undefined) return undefined;
  if (typeof val === 'string') return val;
  return undefined;
}

export function getMdNumber(map: MetadatumMap, key: string): number | undefined {
  const val = getMdValue(map, key);
  if (val === undefined) return undefined;
  if (typeof val === 'bigint') return Number(val);
  return undefined;
}

export function getMdStringOrArray(map: MetadatumMap, key: string): string | string[] | undefined {
  const val = getMdValue(map, key);
  if (val === undefined) return undefined;
  if (Array.isArray(val)) {
    const strings = val.filter((v): v is string => typeof v === 'string');
    return strings.length > 0 ? strings : undefined;
  }
  if (typeof val === 'string') return val;
  return undefined;
}

export function metadatumToUri(val: Metadatum): string | string[] {
  if (Array.isArray(val)) {
    return val.filter((v): v is string => typeof v === 'string');
  }
  if (typeof val === 'string') return val;
  return '';
}

export function getMdBool(map: MetadatumMap, key: string): boolean | undefined {
  const val = getMdValue(map, key);
  if (val === undefined) return undefined;
  if (typeof val === 'bigint') return val !== 0n;
  return undefined;
}

export function getMdLinks(map: MetadatumMap): Record<string, string> | undefined {
  const links = getMdValue(map, 'links');
  if (links === undefined || !(links instanceof MetadatumMap)) return undefined;
  const result: Record<string, string> = {};
  for (const [k, v] of links) {
    if (typeof k !== 'string' || typeof v !== 'string') continue;
    result[k] = v;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}
