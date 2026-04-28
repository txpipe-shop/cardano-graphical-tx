# 08 — Navigation Status Bar + Explorer Header Redesign

## Summary

Replace the current minimal header with a full navigation status bar that exposes all explorer sections (Transactions, Blocks, Addresses, Tokens, Scripts, Governance, Protocol) as horizontal nav links, plus search and chain selector in a unified bar.

## Motivation

The current `Header.tsx` has only 3 buttons: Logo, "Transaction" (→ /tx), "Address" (→ /address), "Explorer" (→ /explorer/[network]/txs). Users can't navigate between explorer sections without manually typing URLs. As we add 7+ new pages, we need a proper navigation bar that stays visible across all explorer pages.

## Proposed Design

### Layout — full-width sticky bar

```
┌──────────────────────────────────────────────────────────────────────┐
│ [TxPipe Logo]  Lace Anatomy                                          │
│                                                                      │
│ ┌──────────── Explorer Navigation ────────────┐  ┌─ Search ────────┐ │
│ │ Txs │ Blocks │ Addresses │ Tokens │ Scripts │  │ Search...   [🔍]│ │
│ │ Governance │ Protocol │ ...                 │  └─────────────────┘ │
│ └─────────────────────────────────────────────┘  ┌─ Chain ─────────┐ │
│                                                  │  Mainnet      ▼ │ │
│                                                  └─────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### Nav links behavior

- Each link navigates to the relevant explorer section for the currently selected chain
- Active section is highlighted (matching current route)
- Links: Transactions, Blocks, Addresses, Tokens, Scripts, Governance, Protocol
- Optional/maybe sections: Epochs, Pools, DReps (shown conditionally based on chain features or tucked under "More")
- Each link uses `router.push()` to maintain client-side navigation
- Links only appear when on an explorer route (`/explorer/*`) — on legacy pages (/tx, /address, /), the header stays minimal

### Sub-bar or "More" dropdown

For less frequently accessed sections, use a "More ▼" dropdown:

```
More ▼
  ├── Epochs
  ├── Pools
  ├── Network Stats
  └── API Docs
```

### Responsive behavior

- On narrow screens (<1024px): collapse nav links into a hamburger menu or horizontal scroll
- Search bar and chain selector always visible

### Legacy page header

When user is on `/`, `/tx`, `/address`, `/tx/grapher`, etc. (non-explorer pages):
- Keep the current minimal header (Logo + Trx button + Address button + Explorer button + Theme toggle)
- These pages are not yet migrated to the explorer paradigm

### Explorer page header

When user is on `/explorer/*`:
- Show the full navigation bar instead of the minimal header
- No need for separate "Transaction" or "Address" buttons (they're nav links now)
- Chain selector integrated into the bar
- Theme toggle kept

### Implementation approach

Create `app/_components/ExplorerNav.tsx` ("use client"):
- Reads current route to determine active section
- Reads chain from configs context (current selected network)
- Renders nav links + search + chain selector
- Exported and used in `app/explorer/layout.tsx`

Modify `app/_components/Header.tsx`:
- Accept an optional `variant` prop: `'default'` | `'explorer'`
- Default variant: current minimal header
- Explorer variant: renders `<ExplorerNav />`

## Acceptance Criteria

- [ ] Navigation bar visible on all `/explorer/*` pages
- [ ] Active section highlighted based on current route
- [ ] All nav links navigate to correct explorer sections
- [ ] Links only navigate when user is on an explorer page (not on legacy pages)
- [ ] Chain selector integrated into the bar (replaces standalone `ChainSelector`)
- [ ] Search bar integrated into the bar (replaces standalone `TxSearch`)
- [ ] Responsive: collapses gracefully on narrow screens
- [ ] "More" dropdown for secondary sections
- [ ] Minimal header preserved for non-explorer pages
- [ ] Theme toggle preserved
- [ ] No layout shift — height consistent with current header

## Dependencies

- #02 (blocks pages — for the Blocks link)
- #03 (address page — for the Addresses link)
- #04 (script page — for the Scripts link)
- #05 (token page — for the Tokens link)
- #06 (protocol page — for the Protocol link)
- #07 (governance page — for the Governance link)
- #09 (search bar — integrated into this nav bar)
- #10, #11, #12 (maybe pages — for More dropdown links)

## Dependents

- This is the shell that holds the search bar (#09) and chain selector
