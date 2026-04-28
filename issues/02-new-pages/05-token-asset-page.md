# 05 — Token / Asset Detail Page

> **good first issue** — This issue is beginner-friendly and reuses existing patterns.

## Summary

Add a token/asset detail page at `/explorer/[chain]/tokens/[unit]` showing asset metadata, total supply, holder distribution, mint/burn history, and recent transactions involving the asset.

## Motivation

Cardano's multi-asset ledger supports thousands of native tokens. Users need to inspect a specific token: who holds it, how much exists, what metadata it carries, and what transactions have moved it.

## Proposed Design

### Route

```
/explorer/[chain]/tokens/[unit]
```

Where `[unit]` is the hex concatenation of policy ID + asset name (e.g., `a1b2c3...d4e5f600000643b0...`).

Also support search by **CIP-14 fingerprint** (common on wallet UIs).

### Page layout

```
┌──────────────────────────────────────────────┐
│ [Logo] MyToken (TKN)                         │
│ Policy: a1b2c3...d4e5 Fingerprint: asset1... │
│ ┌───────────────────────────────────────────┐│
│ │ Total Supply: 10,000,000 TKN              ││
│ │ Holders: 1,234                            ││
│ │ Minted/Burned: 42 events                  ││
│ │ Decimals: 6                               ││
│ │ ── Metadata ──                            ││
│ │ Description: A utility token for...       ││
│ │ URL: https://mytoken.io                   ││
│ └───────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Holders (1,234)] [History] [Transactions]   │ ← tabs
├──────────────────────────────────────────────┤
│ Tab content                                  │
└──────────────────────────────────────────────┘
```

### Tabs

**1. Holders tab** (default)
- Paginated table from `assetsAssetAddressesGet`
- Columns: Address (truncated + link to address page), Quantity (formatted with decimals)

**2. History tab**
- Paginated list from `assetsAssetHistoryGet`
- Each row: Tx Hash (link), Action (mint=green badge, burn=red badge), Amount

**3. Transactions tab**
- Paginated from `assetsAssetTransactionsGet`
- Each row: Tx Hash (link), Index, Block Height, Block Time
- Clicking a tx hash navigates to tx detail page

### Metadata resolution chain

Metadata is resolved in priority order. The first source that returns data wins.

| Priority | Source | Package | Notes |
|----------|--------|---------|-------|
| 1 | **Cardano Token Registry** | `@laceanatomy/cardano-token-registry-sdk` | Off-chain, community-submitted |
| 2 | **CF Token Metadata Registry** | `@laceanatomy/cf-token-metadata-sdk` | Off-chain, Foundation-curated. See [cf-token-metadata-registry](https://github.com/cardano-foundation/cf-token-metadata-registry) |
| 3 | **CIP-68** (on-chain) | `provider-core` / providers | Fetched via UTxORPC by querying the reference token UTxO. Implemented at provider level |
| 4 | **CIP-25** (on-chain) | Blockfrost / providers | From transaction metadata |

#### CIP-68 support (provider-level)

CIP-68 stores token metadata in a **reference token UTxO** locked at a specific script address. The metadata is a CBOR map in the datum of the reference token.

Provider implementation steps:
1. Construct the reference token asset name:
   - Version 1: `000643b0` + asset_name
   - Version 2: `000de140` + asset_name
2. Query the UTxO containing this reference token (via `utxoRpc.query.searchUtxos` or Blockfrost `addressesAddressUtxosAssetGet`)
3. Parse the datum as CBOR metadata map
4. Extract fields: `name`, `description`, `image`, `mediaType`, `files`, etc.

This requires a new optional method on `ChainProvider`:

```ts
getTokenMetadata?(unit: Unit): Promise<TokenMetadata | null>;
```

Or extend the existing provider model to include CIP-68 resolution within `getTx` / `getTxs` when a mint/burn event is detected.

#### CF Token Metadata Registry

A new SDK package `@laceanatomy/cf-token-metadata-sdk` wraps the [CF Token Metadata Registry API](https://github.com/cardano-foundation/cf-token-metadata-registry).

API endpoint (example): `https://api.metadata.registry.cf/v1/`

The package should follow the same pattern as `@laceanatomy/cardano-token-registry-sdk`:
- `CFTokenRegistryClient` class
- `getToken(unit)` method returning `{ name, description, ticker, url, logo, decimals, ... }`
- Error handling for missing tokens

### On-chain metadata provenance

Add a "Metadata Source" badge or section showing:
- Which standard was used (CIP-25, CIP-68, Token Registry, CF Registry)
- For CIP-68: link to the reference token UTxO
- For CIP-25: link to the minting transaction
- Raw metadata JSON/CBOR toggle for transparency

### CIP-14 fingerprint support

Parse the route param:
- If 44 hex chars → unit (policy + asset name)
- If starts with `asset` → CIP-14 fingerprint → resolve to unit via Blockfrost

### Policy-level view

Add a sub-route or query param to view all assets under a policy:

```
/explorer/[chain]/tokens?policy=<policyId>
```

This lists all assets minted under that policy (via `assetsPolicyPolicyIdGet`).

### TokenPill integration

The existing `<TokenPill>` component should link to this token page when clicked (currently it only shows a popover with copy actions).

## Acceptance Criteria

- [ ] `/explorer/[chain]/tokens/[unit]` renders token detail for all 4 networks
- [ ] Token overview card shows supply, holders, mint/burn count, decimals
- [ ] Metadata resolution follows priority: Token Registry → CF Registry → CIP-68 → CIP-25
- [ ] CIP-68 metadata fetched at provider level via reference token UTxO lookup
- [ ] CF Token Metadata SDK package created and integrated
- [ ] Holders tab with pagination and address links
- [ ] History tab with mint/burn events
- [ ] Transactions tab linking to tx detail page
- [ ] CIP-14 fingerprint input supported
- [ ] Policy-level view showing all assets under a policy
- [ ] TokenPill in the rest of the explorer links to this page
- [ ] Metadata source provenance displayed (which standard was used)
- [ ] Error state for invalid/missing tokens
- [ ] Default fallback when metadata is unavailable ("Unknown Token")

## Dependencies

- `#01-a` (provider methods for tokens) OR direct Blockfrost SDK call
- `@laceanatomy/cardano-token-registry-sdk` (already exists)
- `@laceanatomy/cf-token-metadata-sdk` (new package — see separate issue)
- Provider CIP-68 support (see separate provider issue)
- #03 (address page — holder links navigate there)

## Dependents

- #08 (status bar nav link)
- #09 (search bar — token/fingerprint detection)
- #07 (TokenPill linking)
