import { z } from 'zod';

const CIPMetadataFileSchema = z.object({
  name: z.string(),
  mediaType: z.string(),
  src: z.union([z.string(), z.array(z.string())])
});

// CIP-25 (from Blockfrost onchain_metadata)
export const Cip25MetadataSchema = z
  .object({
    name: z.string(),
    image: z.union([z.string(), z.array(z.string())]),
    mediaType: z.string().optional(),
    description: z.union([z.string(), z.array(z.string())]).optional(),
    files: z.array(CIPMetadataFileSchema).optional()
  })
  .passthrough();

// CIP-68 NFT (222)
export const Cip68Nft222Schema = z
  .object({
    name: z.string(),
    image: z.union([z.string(), z.array(z.string())]),
    mediaType: z.string().optional(),
    description: z.union([z.string(), z.array(z.string())]).optional(),
    files: z.array(CIPMetadataFileSchema).optional()
  })
  .passthrough();

// CIP-68 FT (333)
export const Cip68Ft333Schema = z
  .object({
    name: z.string(),
    description: z.string(),
    ticker: z.string().optional(),
    url: z.string().optional(),
    logo: z.union([z.string(), z.array(z.string())]).optional(),
    decimals: z.number().optional()
  })
  .passthrough();

// CIP-68 RFT (444)
export const Cip68Rft444Schema = z
  .object({
    name: z.string(),
    image: z.union([z.string(), z.array(z.string())]),
    mediaType: z.string().optional(),
    description: z.union([z.string(), z.array(z.string())]).optional(),
    decimals: z.number().optional(),
    files: z.array(CIPMetadataFileSchema).optional()
  })
  .passthrough();

// CIP-68 v4 (map format)
export const Cip68MapV4Schema = z.record(
  z.string(),
  z.record(z.string(), z.union([Cip68Nft222Schema, Cip68Ft333Schema, Cip68Rft444Schema]))
);

// Blockfrost onchain_metadata_standard values
export const OnchainMetadataStandardSchema = z.enum([
  'CIP25v1',
  'CIP25v2',
  'CIP68v1',
  'CIP68v2',
  'CIP68v3'
]);
