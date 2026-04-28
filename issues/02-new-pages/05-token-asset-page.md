# 05 — Token / Asset Detail Page

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

### Data source

Blockfrost `CardanoAssetsApi` + `@laceanatomy/cardano-token-registry-sdk` (off-chain metadata):

```
assetsAssetGet(unit)                 → Asset details
assetsAssetAddressesGet(unit)        → Holder list
assetsAssetHistoryGet(unit)          → Mint/burn history
assetsAssetTransactionsGet(unit)     → Recent transactions
```

Plus `TokenRegistryClient.getToken(unit)` from `cardano-token-registry-sdk` for off-chain metadata (name, ticker, description, logo, decimals, url).

### Page layout

```
┌──────────────────────────────────────────────┐
│ [Logo] MyToken (TKN)                         │
│ Policy: a1b2c3...d4e5  Fingerprint: asset1... │
│ ┌────────────────────────────────────────────┐│
│ │ Total Supply: 10,000,000 TKN              ││
│ │ Holders: 1,234                            ││
│ │ Minted/Burned: 42 events                  ││
│ │ Decimals: 6                               ││
│ │ ── Metadata ──                            ││
│ │ Description: A utility token for...       ││
│ │ URL: https://mytoken.io                   ││
│ └────────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Holders (1,234)] [History] [Transactions]    │ ← tabs
├──────────────────────────────────────────────┤
│ Tab content                                   │
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

### Off-chain metadata

Use `TokenRegistryClient.getToken(unit)` to fetch name, ticker, logo, description, url, decimals. Show these at the top of the page. If metadata is unavailable, fall back to on-chain CIP-25/68 metadata available from the Asset response.

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
- [ ] Off-chain metadata displayed (name, ticker, logo, description) when available
- [ ] Holders tab with pagination and address links
- [ ] History tab with mint/burn events
- [ ] Transactions tab linking to tx detail page
- [ ] CIP-14 fingerprint input supported
- [ ] Policy-level view showing all assets under a policy
- [ ] TokenPill in the rest of the explorer links to this page
- [ ] Error state for invalid/missing tokens
- [ ] Default fallback when metadata is unavailable ("Unknown Token")

## Dependencies

- #01 (provider methods for tokens) OR direct Blockfrost SDK call
- `@laceanatomy/cardano-token-registry-sdk` (already exists, needs wiring)
- #03 (address page — holder links navigate there)

## Dependents

- #08 (status bar nav link)
- #09 (search bar — token/fingerprint detection)
- #07 (TokenPill linking)
