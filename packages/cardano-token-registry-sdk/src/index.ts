import fetch from 'cross-fetch';
import { z } from 'zod';

const SignatureSchema = z.object({
  signature: z.string(),
  publicKey: z.string()
});

const EntrySchema = z.object({
  value: z.coerce.string(),
  sequenceNumber: z.number(),
  signatures: z.array(SignatureSchema).optional()
});

const DecimalsEntrySchema = EntrySchema.refine((entry) => Number.isFinite(Number(entry.value)), {
  message: 'Decimals value must be numeric'
}).transform((entry) => ({
  ...entry,
  value: Number(entry.value)
}));

const ResponseSchema = z.object({
  subject: z.string(),
  policy: z.string().optional(),
  name: EntrySchema.optional(),
  description: EntrySchema.optional(),
  ticker: EntrySchema.optional(),
  url: EntrySchema.optional(),
  logo: EntrySchema.optional(),
  decimals: DecimalsEntrySchema.optional()
});

export type TokenRegistryResponse = z.infer<typeof ResponseSchema>;

export type TokenMetadata = {
  decimals: number | null;
  name: string | null;
  description: string | null;
  ticker: string | null;
  url: string | null;
  logo: string | null;
  policy: string | null;
  subject: string;
};

export type TokenRegistryNetwork = 'mainnet' | 'preprod';

const BASE_URLS: Record<TokenRegistryNetwork, string> = {
  mainnet: 'https://tokens.cardano.org',
  preprod: 'https://preprod.tokens.cardano.org'
};

export class TokenRegistryClient {
  private baseUrl: string;

  constructor(network: TokenRegistryNetwork = 'mainnet') {
    this.baseUrl = `${BASE_URLS[network]}/metadata`;
  }

  async getToken(subject: string): Promise<TokenMetadata | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${subject}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch metadata for ${subject}: ${response.statusText}`);
      }

      const data = ResponseSchema.parse(await response.json());

      return {
        subject: data.subject,
        decimals: data.decimals?.value ?? null,
        name: data.name?.value ?? null,
        description: data.description?.value ?? null,
        ticker: data.ticker?.value ?? null,
        url: data.url?.value ?? null,
        logo: data.logo?.value ?? null,
        policy: data.policy ?? null
      };
    } catch (error) {
      console.warn(`Error fetching token metadata for ${subject}`, error);
      return null;
    }
  }

  async getTokens(subjects: string[]): Promise<Map<string, TokenMetadata>> {
    const uniqueSubjects = [...new Set(subjects)];
    const results = await Promise.all(
      uniqueSubjects.map(async (subject) => {
        const metadata = await this.getToken(subject);
        return { subject, metadata };
      })
    );

    const map = new Map<string, TokenMetadata>();
    for (const { subject, metadata } of results) {
      if (metadata) {
        map.set(subject, metadata);
      }
    }
    return map;
  }
}
