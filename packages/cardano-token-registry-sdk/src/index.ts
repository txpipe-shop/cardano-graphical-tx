import fetch from 'cross-fetch';

export type TokenRegistryResponse = {
  subject: string;
  name?: { value: string; [key: string]: any };
  description?: { value: string; [key: string]: any };
  policy?: string;
  ticker?: { value: string; [key: string]: any };
  url?: { value: string; [key: string]: any };
  logo?: { value: string; [key: string]: any };
  decimals?: { value: number; [key: string]: any };
};

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

export class TokenRegistryClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://tokens.cardano.org/metadata') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getToken(subject: string): Promise<TokenMetadata | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${subject}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch metadata for ${subject}: ${response.statusText}`);
      }

      const data = (await response.json()) as TokenRegistryResponse;

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
    // Fetch in parallel
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
