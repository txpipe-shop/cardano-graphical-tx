# Create CF Token Metadata SDK Package

> **good first issue** — This issue is beginner-friendly and mirrors an existing package in the repo.

## Goal
Create a new package `@laceanatomy/cf-token-metadata-sdk` that wraps the [Cardano Foundation Token Metadata Registry API](https://github.com/cardano-foundation/cf-token-metadata-registry).

## Background
The Cardano Foundation maintains a curated token metadata registry alongside the community-run Cardano Token Registry. Our web app needs to query both as part of the metadata resolution chain for the token detail page.

## Package Structure

Follow the same pattern as `@laceanatomy/cardano-token-registry-sdk`:

```
packages/cf-token-metadata-sdk/
├── src/
│   ├── index.ts          # Main exports
│   ├── client.ts         # CFTokenRegistryClient class
│   └── types.ts          # TypeScript interfaces for responses
├── package.json
├── tsconfig.json
└── README.md
```

## API Reference

Base URL: `https://api.metadata.registry.cf/v1/` (verify actual endpoint from CF docs)

### `GET /tokens/{unit}`

Returns metadata for a single token by its unit (policy ID + asset name concatenated).

Expected response shape:
```json
{
  "subject": "a1b2c3...d4e5f600000643b0...",
  "name": { "value": "MyToken", "sequenceNumber": 0 },
  "description": { "value": "A utility token", "sequenceNumber": 0 },
  "ticker": { "value": "TKN", "sequenceNumber": 0 },
  "url": { "value": "https://mytoken.io", "sequenceNumber": 0 },
  "logo": { "value": "...base64...", "sequenceNumber": 0 },
  "decimals": { "value": 6, "sequenceNumber": 0 }
}
```

### `GET /tokens/{unit}/metadata`

Alternative endpoint for fetching raw metadata.

## Implementation

### `CFTokenRegistryClient`

```ts
export class CFTokenRegistryClient {
  private baseUrl: string;

  constructor(baseUrl = 'https://api.metadata.registry.cf/v1/') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getToken(unit: Unit): Promise<CFTokenMetadata | null> {
    const response = await fetch(`${this.baseUrl}/tokens/${unit}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`CF Registry error: ${response.status}`);
    return this.parseMetadata(await response.json());
  }

  private parseMetadata(raw: any): CFTokenMetadata {
    return {
      name: raw.name?.value,
      description: raw.description?.value,
      ticker: raw.ticker?.value,
      url: raw.url?.value,
      logo: raw.logo?.value,
      decimals: raw.decimals?.value ?? 0,
    };
  }
}
```

### Types

```ts
export type CFTokenMetadata = {
  name?: string;
  description?: string;
  ticker?: string;
  url?: string;
  logo?: string; // base64 encoded image
  decimals?: number;
};
```

## Acceptance Criteria
- [ ] Package created at `packages/cf-token-metadata-sdk/`
- [ ] `CFTokenRegistryClient` with `getToken(unit)` method
- [ ] Proper error handling (404 returns null, other errors throw)
- [ ] Types exported for `CFTokenMetadata`
- [ ] Follows monorepo conventions (ESM, TypeScript strict, pnpm workspace)
- [ ] `pnpm build` and `pnpm check` pass
- [ ] Basic unit test with mocked fetch

## Related
- `packages/cardano-token-registry-sdk/` (reference implementation)
- `issues/02-new-pages/05-token-asset-page.md`
