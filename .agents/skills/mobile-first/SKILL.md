# Mobile-First Frontend Skill

## Context
All NEW pages and components in `apps/web` must be built mobile-first. This skill applies to any agent adding routes, components, or layouts to the Next.js App Router frontend.

## Breakpoint Convention

- **Use mobile-first Tailwind:** `className="flex-col md:flex-row"` not `flex-row md:flex-col`
- **Base styles are mobile.** Override up with `sm:`, `md:`, `lg:`.
- **Never use `md:` as the default.** If you find yourself writing `md:` on every property, invert it.

## Touch Targets

- Interactive elements must be at least `44px` tall/wide
- Buttons and links need adequate padding (`p-3` or `px-4 py-2` minimum)
- No text links smaller than `text-sm` on mobile

## Layout Rules

- **No horizontal overflow.** If a table is too wide, make it horizontally scrollable inside a container, or switch to a card/stack layout below `md`.
- **Stack before side-by-side.** Default to `flex-col`. Use `md:flex-row` only when the content actually fits.
- **Hide secondary content behind `<Accordion>` or `<Drawer>`** on small screens rather than shrinking everything.

## Data Tables

On mobile (`< md`), convert tables to cards or stacked rows:
```tsx
// Bad: table shrinks
<table className="w-full text-xs">

// Good: stack on mobile
<div className="grid gap-4 md:table md:w-full">
```

## Canvas / Visualization

- The Konva canvas grapher must support pinch-zoom and pan on touch devices
- Provide a "Simplified View" toggle for mobile that hides non-essential nodes
- Canvas containers should have `touch-action: none` and fixed aspect ratios

## Images & Performance

- Use `next/image` with responsive `sizes`
- Lazy-load images below the fold
- Avoid rendering heavy visualizations on initial mobile paint

## Navigation

- Header nav collapses to hamburger or horizontal scroll below `md`
- Search bar stays visible and full-width on mobile
- Chain selector becomes a bottom-sheet or compact dropdown on small screens

## Testing Checklist

Before marking any UI task complete:
- [ ] Page tested at 375px width (iPhone SE)
- [ ] Page tested at 768px width (tablet)
- [ ] No horizontal scroll
- [ ] All interactive elements tappable without zooming
- [ ] `pnpm lint` and `pnpm check` pass
