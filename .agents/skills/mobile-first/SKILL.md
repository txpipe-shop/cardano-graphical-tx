---
name: mobile-first
description: Enforce mobile-first Tailwind CSS patterns, touch targets, layout rules, and testing checklists for all new pages and components in apps/web.
license: MIT
compatibility: opencode
---

# Mobile-First Frontend Skill

All NEW pages and components in `apps/web` must be built mobile-first. This skill applies to any agent adding routes, components, or layouts to the Next.js App Router frontend.

## Scope

| Area                  | Applies to                             |
| --------------------- | -------------------------------------- |
| Breakpoint convention | All Tailwind `className` usage         |
| Touch targets         | Buttons, links, interactive elements   |
| Layout rules          | Flex/grid, overflow, stacking order    |
| Data tables           | Mobile card/stack conversion           |
| Images & Performance  | `next/image`, lazy loading, paint cost |
| Navigation            | Header, search bar, chain selector     |

## Rules

### 1. Use mobile-first Tailwind

Base styles are mobile. Override up with `sm:`, `md:`, `lg:`.

- **Do:** `className="flex-col md:flex-row"`
- **Don't:** `className="flex-row md:flex-col"`

If you find yourself writing `md:` on every property, invert the base style instead.

### 2. Enforce touch targets

- Interactive elements must be at least **44 px** tall/wide.
- Buttons and links need adequate padding: `p-3` or `px-4 py-2` minimum.
- No text links smaller than `text-sm` on mobile.

### 3. Layout rules

- **No horizontal overflow.** If a table is too wide, make it horizontally scrollable inside a container, or switch to a card/stack layout below `md`.
- **Stack before side-by-side.** Default to `flex-col`. Use `md:flex-row` only when the content actually fits.
- **Hide secondary content behind `<Accordion>` or `<Drawer>`** on small screens rather than shrinking everything.

### 4. Convert data tables on mobile

On mobile (`< md`), convert tables to cards or stacked rows.

- **Don't:**

  ```tsx
  <table className="w-full text-xs">
  ```

- **Do:**
  ```tsx
  <div className="grid gap-4 md:table md:w-full">
  ```

### 5. Images & Performance

- Use `next/image` with responsive `sizes`.
- Lazy-load images below the fold.
- Avoid rendering heavy visualizations on initial mobile paint.

### 6. Navigation

- Header nav collapses to hamburger or horizontal scroll below `md`.
- Search bar stays visible and full-width on mobile.
- Chain selector becomes a bottom-sheet or compact dropdown on small screens.

## Verification

Before marking any UI task complete, do all of the following in order:

1. Re-read every `className` you added. Confirm every property follows mobile-first ordering (base = mobile, override up).
2. Page tested at **375 px** width (iPhone SE).
3. Page tested at **768 px** width (tablet).
4. Confirm **no horizontal scroll**.
5. Confirm **all interactive elements are tappable without zooming**.
6. Run `pnpm lint` and `pnpm check`; both must pass.

## What NOT to do

- Don't use `md:` as the default breakpoint.
- Don't shrink tables with `text-xs` on mobile — convert to cards or stacked rows.
- Don't render heavy visualizations on initial mobile paint.
- Don't hardcode pixel values for touch targets when Tailwind utility classes suffice.
- Don't leave secondary content visible and crammed on small screens — use `Accordion` or `Drawer`.
