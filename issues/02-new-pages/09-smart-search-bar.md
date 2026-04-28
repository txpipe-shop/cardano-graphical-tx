# 09 — Incremental Smart Search Bar

## Summary

Upgrade the explorer search from a single-purpose transaction hash search into a smart search that detects the input type (tx hash, block hash/height, address, script hash, token unit, pool ID, DRep ID, ADA Handle, epoch number) and routes to the correct page.

## Motivation

The current search (`TxSearch.tsx`) only accepts transaction hashes and blindly navigates to `/explorer/[chain]/txs/[hash]`. With 7+ new page types, users need a single search bar that figures out what they typed and sends them to the right place. This is standard on every blockchain explorer (cardanoscan, cexplorer, mempool.space).

## Proposed Design

## Phased Detection Rollout

### Phase 1 — Core Types (ship first)
These cover 90% of real user searches:

| Priority | Pattern | Type | Route |
|----------|---------|------|-------|
| 1 | 64 hex chars | `tx` | `/txs/[hash]` (fallback; if not found, try block) |
| 2 | Starts with `addr1`, `addr_test1` | `address` | `/addresses/[address]` |
| 3 | Starts with `stake1`, `stake_test1` | `address` | `/addresses/[address]` |
| 4 | Positive integer | `block_height` | `/blocks/[height]` |
| 5 | 64 hex (fallback) | `tx` | `/txs/[input]` |

### Phase 2 — Assets & Scripts
Add after Phase 1 pages exist:

| Pattern | Type | Route |
|---------|------|-------|
| Starts with `asset` + hex | `token` (fingerprint) | `/tokens/[fingerprint]` |
| 56+ hex chars (policy concat) | `token` (unit) | `/tokens/[unit]` |
| 56 hex chars | `script` | `/scripts/[hash]` |
| Starts with `script` + hex | `script` | `/scripts/[hash]` |

### Phase 3 — Governance & Handles
Add after governance/ADA Handle pages exist:

| Pattern | Type | Route |
|---------|------|-------|
| Starts with `$` | `handle` | Resolve → `/addresses/[addr]` |
| Starts with `pool1` | `pool` | `/pools/[id]` |
| Starts with `drep1` | `drep` | `/governance/dreps/[id]` |
| Positive integer (alt) | `epoch` | `/epochs/[number]` |

## Ambiguous Inputs (Phase 1 only)

**64 hex chars:** Navigate to tx detail by default. If the tx is not found, show a "Search for block?" link on the error state.

**Large integers:** Assume block height for Phase 1. Epoch disambiguation comes in Phase 3.

### Search results page (optional refinement)

For ambiguous inputs where the type can't be confidently determined, navigate to a search results page that shows possible matches:

```
/explorer/[chain]/search?q=abc123...
```

This page would query multiple endpoints and show results grouped by type:
- "1 Transaction found"
- "0 Blocks found"
- "1 Address found"
- "3 Tokens found"

This is a nice-to-have; the initial implementation can just pick the most likely type and navigate there.

### Component

Replace `TxSearch.tsx` with `ExplorerSearch.tsx`:

### Placeholder

The search placeholder should be dynamic: "Search transactions, blocks, addresses, tokens, scripts, pools..."

### Integration points

- `ExplorerSearch` is rendered inside the `ExplorerNav` component (#08) — no longer a standalone element on each page
- On non-explorer pages, the search bar is not shown (or redirects to explorer)
- The search bar should be prominent (full width or nearly full width in the nav bar)

## Acceptance Criteria

- [ ] Phase 1 detection correctly identifies tx hashes, addresses, and block heights
- [ ] Phase 1 navigates to the correct page for each input type
- [ ] Invalid/unrecognized inputs show a user-friendly error toast
- [ ] Placeholder text matches Phase 1 capabilities (e.g., "Search transactions, blocks, addresses...")
- [ ] Search works on all explorer pages
- [ ] Enter key and search button both trigger search
- [ ] Chain context preserved
- [ ] Phase 2/3 rules are stubbed or gated, not broken

## Dependencies

### Phase 1
- `explorer-block-scroll` — block height search needs block pages
- `#03` — address page must exist for address search

### Phase 2
- `#04` — script page
- `#05` — token page

### Phase 3
- `#06` — protocol/epoch context
- `#07` — governance page
- `#13` — ADA Handle resolution

## Dependents

- #08 (navigation bar integrates this search)
