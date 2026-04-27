# 03 — Make Explorer Data Flow Chain-Generic

## Summary

Replace all hardcoded `cardano.Tx`, `cardano.UTxO`, `cardano.Redeemer` etc. in explorer route handlers, page components, and data-loading utilities with the generic `ChainProvider<U, T, Chain>` types.

## Motivation

Currently every explorer page, handler, and shared utility imports types directly from `@laceanatomy/types`:

```ts
// app/explorer/[chain]/txs/[hash]/_shared.ts
import { type cardano } from '@laceanatomy/types';
export async function loadTxPageData(
  provider: ChainProvider<cardano.UTxO, cardano.Tx, Cardano>,
  ...
): Promise<cardano.Tx> { ... }
```

This ties the entire explorer to Cardano. To support other chains, the data flow must be parameterized by the chain type.

## Proposed Changes

### 1. Generic loaders in `_shared.ts` / `_utils.ts`

Convert from:
```ts
ChainProvider<cardano.UTxO, cardano.Tx, Cardano>
```
to:
```ts
ChainProvider<U, T, Chain>
```

The page components themselves become generic or receive pre-resolved typed data:

```ts
// Before
function TxDetailPage({ tx }: { tx: cardano.Tx }) { ... }

// After — page receives resolved data + chain descriptor
function TxDetailPage({ tx, chain }: { tx: unknown; chain: ChainDescriptor }) {
  // chain-specific slot components know their tx type internally
}
```

### 2. Affected files

| File | Current coupling | Action |
|------|-----------------|--------|
| `app/explorer/[chain]/txs/[hash]/_shared.ts` | `ChainProvider<cardano.UTxO, cardano.Tx, Cardano>` | Make generic |
| `app/explorer/[chain]/txs/[hash]/_utils.ts` | `ChainProvider<cardano.UTxO, cardano.Tx, Cardano>` | Make generic |
| `app/explorer/[chain]/txs/[hash]/page.tsx` | Server component using `cardano.Tx` | Accept generic data |
| `app/explorer/[chain]/txs/[hash]/DevnetTxTabs.tsx` | Client devnet with `cardano.Tx` | Accept generic data |
| `app/explorer/[chain]/txs/page.tsx` | `cardano.Tx[]` in tx list | Accept generic data |
| `app/explorer/[chain]/txs/DevnetTransactionsList.tsx` | `cardano.Tx[]` | Accept generic data |
| `app/_components/ExplorerSection/Transactions/*.tsx` | All import `cardano.Tx`, `cardano.UTxO` | See #05, #06 |

### 3. Strategy

For route handlers (server components), keep the provider typed internally but erase the type at the page boundary. The page receives `unknown` and passes it to chain-specific slot components which re-assert their expected type. This avoids generics in JSX (which React/Next.js can't do natively).

## Acceptance Criteria

- [ ] No `cardano.Tx` or `cardano.UTxO` imports in explorer route handler files or page files
- [ ] `_shared.ts` and `_utils.ts` use generic `ChainProvider<U, T, Chain>` signatures
- [ ] Existing Cardano explorer pages still work identically
- [ ] TypeScript compilation passes

## Dependencies

- #01 (`ChainDescriptor` type)
- #04 (provider factory)

## Dependents

- #05 (TxTable/TxRow)
- #06 (TxTabs)
