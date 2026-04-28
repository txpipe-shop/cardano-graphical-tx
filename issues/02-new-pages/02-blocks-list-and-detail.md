# 02 — Block Detail Page

> **good first issue** — This issue is beginner-friendly and reuses existing patterns.

## Summary

Add a tabbed block detail page at `/explorer/[chain]/blocks/[id]`. The blocks list is already provided by the refactored `/explorer/[chain]/txs` page (see `explorer-block-scroll`), which renders foldable block accordions. This page is for drilling into a single block.

## Motivation

Users need a dedicated page to inspect a single block's metadata and see all its transactions without the accordion interaction. A tabbed layout keeps the page organized and consistent with the existing transaction detail page.

## Proposed Design

### Route structure

```
/explorer/[chain]/blocks/[id]          → Block detail page (server component)
```

Where `[id]` accepts: block hash (hex), block height (number), or block slot (number).

Tabs are selectable via query param: `?tab=overview|transactions|io|cbor`.

### Step 1: Extract `DetailTabs` shell component

Create `app/_components/DetailTabs.tsx` to unify the tab styling used by both transaction and block detail pages.

```tsx
"use client";

import { Tab, Tabs } from "@heroui/react";
import { useState, useEffect } from "react";

interface DetailTab {
  key: string;
  title: string;
  content: React.ReactNode;
}

interface DetailTabsProps {
  tabs: DetailTab[];
  defaultTab: string;
  activeTab?: string;
  onTabChange?: (key: string) => void;
}

export function DetailTabs({ tabs, defaultTab, activeTab, onTabChange }: DetailTabsProps) { } 
```

**Migrate `TxTabs` to use `DetailTabs`:** Replace the inline `Tabs` markup in `TxTabs.tsx` with `<DetailTabs tabs={[...]} defaultTab="Overview" />`. No visual change for transaction pages — this is a pure refactor.

### Step 2: Create `BlockTabs` component

Create `app/_components/ExplorerSection/Blocks/BlockTabs.tsx`:

### Step 3: Tab contents

#### Overview tab
- Block metadata card: Hash (with CopyButton), Height, Slot, Epoch, Time, Confirmations, Size
- Aggregate stats card: Total transactions, Total fees (ADA), Total ADA moved, Unique addresses involved

#### Transactions tab
- Full `TxTable` with all transactions in the block
- Pagination if the block has many transactions

#### IO tab
- **Aggregated stats only** (not raw UTxO lists, which would be overwhelming for large blocks)
- Total ADA into the block (sum of all inputs)
- Total ADA out of the block (sum of all outputs)
- Top sender addresses by value
- Top recipient addresses by value
- Asset movement summary (which native assets moved, in what quantities)

#### CBOR tab
- Raw block CBOR hex from `AnyChainBlock.nativeBytes`
- Copy button to clipboard
- Optional: toggle between hex view and pretty-printed bytes

### Step 4: Block detail page server component

**File:** `app/explorer/[chain]/blocks/[id]/page.tsx`


### Step 5: Navigation integration

- Block detail is reachable by clicking a block header in the `/explorer/[chain]/txs` accordion view
- Header/nav does **not** need a separate "Blocks" link (txs page already serves that purpose)

### Edge cases

- Block not found → styled error card
- Invalid block ID → fallback to error state
- Devnet blocks via U5CProvider (already supported by `getBlock`)
- Empty block → "This block contains no transactions."
- Missing CBOR → CBOR tab shows "CBOR not available for this block"

## Acceptance Criteria

- [ ] `DetailTabs` component created at `app/_components/DetailTabs.tsx`
- [ ] `TxTabs` refactored to use `DetailTabs` with no visual regression
- [ ] `/explorer/[chain]/blocks/[id]` renders tabbed block detail
- [ ] All 4 tabs (Overview, Transactions, IO, CBOR) function correctly
- [ ] Block ID parsing handles hash, height, and slot formats
- [ ] Devnet blocks work via U5CProvider
- [ ] Query param `?tab=` controls active tab
- [ ] Loading skeleton shown during data fetch
- [ ] Error state shown when provider fails
- [ ] Consistent styling with existing explorer pages

## Dependencies

- `explorer-block-scroll` — for shared `TxTable` component
- `provider-core` — if adding optional `getBlockCBOR` method

## Notes

- The blocks list page (`/explorer/[chain]/blocks`) is intentionally omitted because the refactored txs page already provides a scrollable list of blocks.
- The "IO" tab shows aggregated statistics, not individual UTxO lists, to avoid overwhelming the UI for large blocks.
