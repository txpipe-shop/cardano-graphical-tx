# Issue 04: UI — Refactor explorer txs page to scroll by foldable blocks

> **good first issue** — This issue is beginner-friendly and a great way to get familiar with the Next.js frontend and Heroui components.

## Goal
Update `apps/web/app/explorer/[chain]/txs/page.tsx` (and devnet variant) so the page scrolls blocks instead of a flat transaction list. Each block is a foldable accordion containing its transactions.

## Background
Once `getBlocksWithTxs` is available in both `DolosProvider` and `U5CProvider`, the UI can fetch blocks + txs in a single round-trip per page and render them grouped.

## Changes

### New file: `apps/web/app/_components/ExplorerSection/Transactions/BlockTxsAccordion.tsx`

A client component that renders a Heroui `Accordion` of blocks.

- **Block header (AccordionItem title):**
  - Block height (prominent)
  - Time ago (from `block.time`)
  - Tx count (`block.txCount`)
  - Total fees
  - Optional: epoch, size
- **Block body (expanded):**
  - Render `<TxTable transactions={block.transactions} chain={chain} />` (reuses existing rows)

### New file: `apps/web/app/_components/ExplorerSection/Transactions/BlockTxsSkeleton.tsx`

Skeleton loader showing N block-header bars with a collapsed appearance, replacing `TxTableSkeleton` in the `Suspense` fallback.

Add `EXPLORER_BLOCK_PAGE_SIZE = 10n` to `apps/web/app/_utils/constants.ts`.

## UX Decisions
- **Default expand state:** Expand the most recent block; collapse older ones.
- **Blocks per page:** `10n` (same as previous flat tx count, but now blocks).
- **Pagination:** Cursor-based. The `nextCursor` from the provider response should be passed through query params (`?cursor=...`) for server-side pagination, or we can implement infinite scroll on the client. **Recommendation:** start with query-param pagination (simplest, matches current pattern).

## Acceptance Criteria
- [ ] Blocks render as foldable accordions.
- [ ] Each accordion item shows block metadata in the header.
- [ ] Expanding a block shows its transactions using the existing `TxRow` component.
- [ ] Skeleton loader shows block-shaped placeholders, not raw tx rows.
- [ ] Devnet path works identically via `U5CProvider.getBlocksWithTxs`.
- [ ] `pnpm check` and `pnpm lint` pass.

## Related
- Previous: [03-u5c-dumpHistory-implementation.md](03-u5c-dumpHistory-implementation.md)
- Follow-up: [05-migrate-getBlocks-to-dumpHistory.md](05-migrate-getBlocks-to-dumpHistory.md)
