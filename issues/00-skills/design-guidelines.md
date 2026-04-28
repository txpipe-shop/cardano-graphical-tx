# Create Skill: Design & Code Quality Guidelines

> **good first issue** — This issue is beginner-friendly and sets the tone for all future contributions.

## Goal
Create a repository skill (`.agents/skills/design-guidelines/SKILL.md`) that documents the architectural and code-quality guidelines for `cardano-graphical-tx`.

## Important note
**These guidelines are aspirational.** Legacy code may not follow them. Any new file, component, or provider method must adhere to them. When modifying legacy code, refactor it to comply if the change is non-trivial.

## Scope

The skill should cover:

### 1. Single Responsibility for UI Components
- Components should be short and do one thing
- Avoid nested conditional rendering that makes JSX hard to scan
- If a component has more than ~100 lines or multiple `useState` hooks, split it
- Example: `TxRow` shows one transaction. `BlockTxsAccordion` shows one block. They don't mix concerns.

### 2. Extract Complex Logic into Hooks
- Multi-step state logic, derived state, and side effects belong in custom hooks
- Hooks should be co-located with the component or in `app/_hooks/`
- Example: pagination state, form validation, canvas coordinate math

### 3. Type Ownership
- All provider-related types belong in `packages/provider-core/src/index.ts`
- Never duplicate `Tx`, `UTxO`, `BlockMetadata`, etc. in app or provider packages
- UI-specific types can live next to the component if they're not reusable

### 4. Sensitive Data
- Base URLs, API keys, and node endpoints must never be hardcoded
- Server-side config flows through `getNetworkConfigServer(chain)`
- Client-side config (devnet port) flows through user settings
- Environment variables are the only source of secrets

### 5. Server/Client Boundary
- Data fetching happens server-side: route handlers, server components, tRPC
- Interactivity happens client-side: accordions, pagination clicks, modals
- Never import server-only modules (e.g., `server/api/*`) into client components
- Use `Suspense` and streaming for async server data

### 6. Styling Conventions
- Use Tailwind CSS utility classes exclusively
- Use Heroui components (`Card`, `Accordion`, `Button`, etc.) for common UI primitives
- No inline styles, no CSS-in-JS, no custom CSS files for one-off components
- Theme tokens come from the Tailwind config (e.g., `bg-surface`, `text-p-secondary`)

## Related files to reference
- `apps/web/app/_components/ExplorerSection/Transactions/TxRow.tsx` — good example of focused component
- `apps/web/app/_components/GraphicalSection/InfoPanel/TxInfo.tsx` — example of complex UI using Heroui Accordion
- `packages/provider-core/src/index.ts` — type ownership
- `apps/web/server/api/dolos-provider.ts` — server-side config

## Acceptance Criteria
- [ ] Skill file created at `.agents/skills/design-guidelines/SKILL.md`
- [ ] Includes the "aspirational / legacy grandfathered" disclaimer
- [ ] All 6 sections are documented with concrete examples from the codebase
- [ ] Mentions sensitive data handling explicitly
- [ ] References at least 3 real files as examples

## Related
- `issues/skills/provider-core.md`
- `issues/skills/utxorpc.md`
