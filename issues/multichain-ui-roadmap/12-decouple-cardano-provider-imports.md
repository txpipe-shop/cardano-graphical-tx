# 12 — Decouple UI Code from Cardano Provider Packages

## Summary

Remove all direct imports of `@laceanatomy/cardano-provider-u5c`, `@laceanatomy/cardano-provider-dolos`, and `@laceanatomy/cardano-provider-dbsync` from `app/` code. All provider access goes through `@laceanatomy/provider-core`'s `ChainProvider` interface, with concrete instantiations limited to the factory module.

## Motivation

Currently the UI code directly imports concrete provider classes:

```ts
// app/_components/Input/TxInput/txInput.helper.ts
import { U5CProvider } from '@laceanatomy/cardano-provider-u5c';

// app/_hooks/useNetwork.tsx
import { U5CProvider } from '@laceanatomy/cardano-provider-u5c';

// app/_utils/u5c-provider-web.ts
import { U5CProvider } from '@laceanatomy/cardano-provider-u5c';

// app/explorer/[chain]/txs/[hash]/_shared.ts
import { cardano } from '@laceanatomy/types';
```

This means:
1. Adding a new chain requires touching dozens of component files
2. The UI bundle includes all provider code even for chains the user isn't viewing
3. Provider implementations can't be swapped without code changes

## Proposed Changes

### Allowed imports from `app/` code

Only these packages may be imported directly by UI components:

| Package | What it provides |
|---------|-----------------|
| `@laceanatomy/provider-core` | `ChainProvider` interface, request/response types |
| `@laceanatomy/types` | `BaseChain`, `UTxO`, `Tx`, `Value`, `Hash`, `Address` (base types only, NOT `cardano.*`) |

### Forbidden imports from `app/` code

| Package | Why |
|---------|-----|
| `@laceanatomy/cardano-provider-u5c` | Concrete Cardano implementation |
| `@laceanatomy/cardano-provider-dolos` | Concrete Cardano implementation |
| `@laceanatomy/cardano-provider-dbsync` | Concrete Cardano implementation |
| `@laceanatomy/napi-pallas` | Cardano CBOR parser (only used in API routes + legacy pages) |
| `@laceanatomy/types` (`cardano` namespace) | Chain-specific types |

### Where concrete imports go

Only the provider factory (issue #04) and chain registry (issue #01) import concrete providers:

```
app/_utils/provider-factory.ts      ← imports dolos, u5c, dbsync
app/_utils/chain-registry.ts        ← imports cardano.* types for type annotations
```

Everything else uses the interface.

### Refactoring target files

| File | Current import | Replace with |
|------|---------------|-------------|
| `app/_components/Input/TxInput/txInput.helper.ts` | `U5CProvider`, `cardano.UTxO`, `cardano.Tx` | `ChainProvider`, base `UTxO`, base `Tx` |
| `app/_hooks/useNetwork.tsx` | `U5CProvider`, `cardano.UTxO`, `cardano.Tx` | `chainRegistry`, `resolveProvider` |
| `app/_utils/u5c-provider-web.ts` | `U5CProvider`, cardano types | Move factory logic one level deeper, this file becomes a thin wrapper |
| `app/explorer/*/_shared.ts` | `cardano.UTxO`, `cardano.Tx`, `Cardano` | Generic `ChainProvider<U, T, Chain>` |
| `app/explorer/*/page.tsx` | DolosProvider import | `resolveProvider` |
| `app/_components/ExplorerSection/Transactions/*.tsx` | `cardano.Tx`, `cardano.UTxO`, `cardano.Redeemer`, etc. | Chain-specific slot components (see #05, #06) |

### Legacy pages (untouched for now)

These pages are Cardano-only and will remain so until a decision is made on the legacy path migration:

```ts
// These can keep cardano imports for now
app/tx/*
app/address/*
app/api/cbor/*
app/api/hash/*
app/api/address/*
```

## Acceptance Criteria

- [ ] Zero imports of `@laceanatomy/cardano-provider-*` from `app/` code (excl. factory + registry)
- [ ] Zero imports of `cardano.*` types from explorer components
- [ ] All provider access through `ChainProvider` interface
- [ ] Legacy pages (`/tx`, `/address`, API routes) still work with their Cardano imports
- [ ] TypeScript compilation passes
- [ ] No runtime regressions

## Dependencies

- #04 (provider factory exists to import the concrete providers)
- #03 (generic data flow)
- #05, #06 (components refactored to use chain slots)

## Dependents

- This is a cross-cutting cleanup; it touches many files but is conceptually simple
