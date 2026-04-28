# 02 — Blocks List Page and Block Detail Page

## Summary

Add two new explorer pages: a blocks list page (`/explorer/[chain]/blocks`) and a single block detail page (`/explorer/[chain]/blocks/[id]`). These use the existing `getBlocks` and `getBlock` ChainProvider methods.

## Motivation

The explorer currently only has transaction pages (`/explorer/[chain]/txs` and `/explorer/[chain]/txs/[hash]`). Users need to browse blocks, see block metadata (hash, height, slot, tx count, fees, time, confirmations), and drill into a single block to see its transactions.

## Proposed Design

### Route structure

```
/explorer/[chain]/blocks               → Blocks list page (server component)
/explorer/[chain]/blocks/[id]          → Block detail page (server component)
```

Where `[id]` accepts: block hash (hex), block height (number), or block slot (number).

### Blocks list page

**File:** `app/explorer/[chain]/blocks/page.tsx`

- Server component with `revalidate = 10` (ISR, same as tx list)
- Calls `provider.getBlocks({ limit: EXPLORER_PAGE_SIZE, offset: ..., query: {} })`
- Falls back to direct Blockfrost `CardanoBlocksApi.blocksLatestGet()` for Dolos chains
- Renders a table (following same styling as TxTable):

| Column | Source | Format |
|--------|--------|--------|
| Height | `block.height` | Right-aligned number |
| Hash | `block.hash` | Truncated, monospace, links to block detail |
| Age | `block.time` | "X seconds/minutes/hours ago" |
| Transactions | `block.txCount` | Right-aligned number |
| Fees (ADA) | `block.fees` | ADA formatting |
| Confirmations | `block.confirmations` | Right-aligned number |
| Epoch/Slot | `block.epoch` / `block.slot` | "E/epoch S/slot" |
| Size | `block.size` | KB formatting |

- Pagination at the bottom
- Loading skeleton and empty state (consistent with TxTableSkeleton)

### Block detail page

**File:** `app/explorer/[chain]/blocks/[id]/page.tsx`

- Server component
- Resolves the block by parsing `[id]`:
  ```ts
  const blockReq: BlockReq = isHex(id) ? { hash: id } :
                               !isNaN(id) && Number(id) > 1000000 ? { slot: BigInt(id) } :
                               { height: BigInt(id) };
  const block = await provider.getBlock(blockReq);
  ```
- Shows block overview card:

| Field | Value |
|-------|-------|
| Block Hash | Full hex hash (monospace) + CopyButton |
| Height | block.height |
| Slot | block.slot |
| Epoch | block.epoch |
| Time | Formatted timestamp |
| Transactions | block.txCount (link to filtered tx list) |
| Total Fees | block.fees (ADA) |
| Confirmations | block.confirmations |
| Size | block.size |

- Below the overview card: an **embedded transaction list** for this block's transactions
  - Calls `provider.getTxs({ limit: ..., offset: ..., query: { block: { hash: block.hash } } })`
  - Renders the same `<TxTable>` component
- If block has no transactions: "This block contains no transactions."

### Component reuse

- `<TxTable>` — reused for block's transaction list
- `<Pagination>` — reused for both block list and block's tx list
- `<CopyButton>` — for block hash
- `<ColoredAddress>` — for any addresses in tx list
- `<ClockIcon>` — for age column

### Navigation integration

- Header add a "Blocks" button next to the existing "Explorer" button
- The explorer layout breadcrumb updates for blocks path
- `<ChainSelector>` works identically (blocks are chain/network-aware)

### Edge cases

- Block not found → styled error card
- Invalid block ID → fallback to error state
- Devnet blocks via U5CProvider (already supported by `getBlock`)
- Empty block list → "No blocks found" empty state

## Acceptance Criteria

- [ ] `/explorer/[chain]/blocks` renders paginated block list for all 4 networks
- [ ] `/explorer/[chain]/blocks/[id]` renders block detail + embedded tx list
- [ ] Block ID parsing handles hash, height, and slot formats
- [ ] Devnet blocks work via U5CProvider
- [ ] Pagination works on both list and detail page
- [ ] Loading skeleton shown during data fetch
- [ ] Error state shown when provider fails
- [ ] Links between block page and tx detail page work
- [ ] Consistent styling with existing explorer pages
- [ ] `ISR revalidate = 10` configured

## Dependencies

- None — uses existing `getBlocks` and `getBlock` on `ChainProvider` (already implemented in all 3 providers)
- #09 (search bar — for block hash search)
- #08 (status bar — for blocks nav link)

## Dependents

- #08 (navigation bar needs the block route to link to)
