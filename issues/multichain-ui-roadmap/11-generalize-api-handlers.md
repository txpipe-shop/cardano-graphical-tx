# 11 — Generalize Explorer API Handlers for `ChainProvider`

## Summary

Replace Cardano-specific API route handlers and data-loading utilities with generic implementations that work with any `ChainProvider`.

## Motivation

The explorer currently has three API route handlers that are tightly coupled to Cardano:

| Handler | Endpoint | Cardano coupling |
|---------|----------|-----------------|
| `cbor.handler.ts` | `POST /api/cbor` | Uses Blockfrost to resolve inputs, calls napi-pallas `cborParse()` (Cardano-only) |
| `hash.handler.ts` | `GET /api/hash` | Calls Blockfrost `cardano-{network}.blockfrost.io/txs/{hash}/cbor` |
| `address.handler.ts` | `POST /api/address` | Calls napi-pallas `parseAddress()` (Cardano-only) |
| `_utils.ts` (explorer) | Server-side data load | Uses `getDolosProvider` with Blockfrost hybrid |

For the explorer pages, data loading should go through `ChainProvider` methods directly (server-side), not through the legacy API routes. The legacy API routes (`/api/cbor`, `/api/hash`, `/api/address`) can stay as-is for the legacy non-explorer pages (`/tx/grapher`, `/address`).

## Proposed Changes

### Server-side: use `ChainProvider` directly

Explorer pages (server components) should call `ChainProvider` methods directly rather than making HTTP calls to API routes:

```tsx
// Before: server component makes fetch() to API route
const res = await fetch(`${baseUrl}/api/hash?network=${chain}&txId=${hash}`);
const { cbor } = await res.json();

// After: server component calls provider directly
const provider = resolveProvider(chainId, 'server');
const tx = await provider.getTx({ hash });
const cbor = await provider.getCBOR({ hash });
const block = await provider.getBlock({ hash: tx.block?.hash });
```

This means:
- Explorer `page.tsx` files import `resolveProvider` and `chainRegistry`
- Explorer `_utils.ts` / `_shared.ts` use `ChainProvider` generically
- The Dolos/U5C provider factory handles all backend concerns

### Devnet client-side

Devnet is special — it uses browser-side gRPC-web via `U5CProvider` (client transport). This path already works generically because the client-side `useTransactionLoader` hook calls `provider.getTx()`, `provider.getCBOR()` directly. We just need to:
1. Use `resolveProvider(chainId, 'client')` instead of a hardcoded U5C constructor
2. Pass the chain descriptor for component resolution

### What stays as-is

- `/api/cbor` — legacy CBOR parsing for the `/tx/grapher` and `/tx/dissect` pages (Cardano-only)
- `/api/hash` — legacy hash→CBOR lookup for non-explorer pages
- `/api/address` — legacy address parser page
- `app/_utils/fetch.ts` — legacy fetch helpers for non-explorer pages

These are only used by the standalone pages (`/tx`, `/address`), which the user marked as "not sure yet" about migrating.

### Affected files

| File | Action |
|------|--------|
| `app/explorer/[chain]/txs/[hash]/_utils.ts` | Replace `fetch()` with direct `provider.getTx()` call |
| `app/explorer/[chain]/txs/[hash]/_shared.ts` | Generic over `ChainProvider` |
| `app/explorer/[chain]/txs/[hash]/page.tsx` | Use `resolveProvider` + chain registry |
| `app/explorer/[chain]/txs/page.tsx` | Use `resolveProvider` + chain registry |
| `app/explorer/[chain]/txs/DevnetTransactionsList.tsx` | Use `resolveProvider(chainId, 'client')` |
| `app/explorer/[chain]/txs/[hash]/DevnetTxTabs.tsx` | Use `resolveProvider(chainId, 'client')` |

## Acceptance Criteria

- [ ] Explorer server pages use `ChainProvider` directly, not API route fetch calls
- [ ] Explorer client-side (devnet) uses generic `resolveProvider`
- [ ] Legacy API routes (`/api/cbor`, `/api/hash`, `/api/address`) untouched
- [ ] Legacy standalone pages (`/tx/grapher`, `/address`) still work
- [ ] Explorer transaction detail loads correctly for all Cardano networks
- [ ] Explorer transaction list pages load correctly
- [ ] Error handling works when provider throws
- [ ] Loading states work

## Dependencies

- #04 (provider factory)
- #03 (generic data flow)

## Dependents

- #05, #06 (component refactors need the data flow to be generic)
