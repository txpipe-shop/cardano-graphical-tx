# Mobile Responsiveness Audit

> **good first issue** — This issue is beginner-friendly and a great way to get familiar with the entire frontend surface area.

## Goal
Ensure all pages in `apps/web` are usable on mobile devices (down to ~375px width). The developer implementing this should use their judgment to decide which elements to hide, rearrange, or simplify for smaller screens.

## Scope
All pages under `apps/web/app/`:
- `/explorer/[chain]/txs` and `/explorer/[chain]/txs/[hash]`
- `/tx/grapher` and `/tx/dissect`
- `/address`
- Any other public-facing routes

## Guiding Principles
- **Progressive disclosure:** Show the most important information first; hide or collapse secondary details behind taps/accordions
- **Touch-friendly:** Interactive elements should be easy to tap without zooming
- **No horizontal overflow:** Content should fit within the viewport or scroll horizontally only where appropriate (e.g., data tables)
- **Performance:** Mobile devices may have slower CPUs; consider lazy-loading or simplifying heavy visualizations

## What the developer decides
The implementer should audit each page and decide:
- What to hide vs. what to show
- Whether to stack, collapse, or truncate
- Whether the canvas grapher needs zoom/pan, a simplified view, or both
- How navigation (header, search, chain selector) should adapt

## Acceptance Criteria
- [ ] No critical functionality is inaccessible on mobile
- [ ] `pnpm lint` and `pnpm check` pass after changes

## Notes
- The codebase currently uses desktop-first breakpoints (`md:`). The implementer can choose to keep this pattern or migrate to mobile-first.
- Heroui components already have responsive behaviors; leverage them before writing custom media queries.
- Do not break desktop layout while improving mobile.

## Related
- `apps/web/app/_components/ExplorerSection/Transactions/TxRow.tsx`
- `apps/web/app/_components/GraphicalSection/`
- `apps/web/app/_components/Header.tsx`
