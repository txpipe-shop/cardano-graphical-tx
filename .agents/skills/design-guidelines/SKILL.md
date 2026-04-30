---
name: DesignGuidelines
description: Architectural and code-quality guidelines for cardano-graphical-tx
license: MIT
---

## Aspirational disclaimer

These guidelines are **aspirational**. Legacy code may not follow them. Any new file, component, or provider method **must** adhere to them. When modifying legacy code, refactor it to comply if the change is non-trivial.

## 1. Single Responsibility for UI Components

Components should be short and do one thing. Avoid nested conditional rendering that makes JSX hard to scan. If a component has more than ~100 lines or multiple `useState` hooks, split it.

**Example:** `TxRow` shows one transaction. `BlockTxsAccordion` shows one block. They don't mix concerns.

**Reference:** [`apps/web/app/_components/ExplorerSection/Transactions/TxRow.tsx`](apps/web/app/_components/ExplorerSection/Transactions/TxRow.tsx)

- `TxRow` (~130 lines total) is already pushing the limit, but it delegates layout to two focused sub-components:
  - `TxRowHeader` — renders the hash, timestamp, fee, and action buttons
  - `UTxOsColumn` — renders inputs or outputs in a column
- Each sub-component has a single props interface and no conditional state logic

> If `TxRow` also handled pagination or block grouping, it would violate this rule.

## 2. Extract Complex Logic into Hooks

Multi-step state logic, derived state, and side effects belong in custom hooks. Hooks should be co-located with the component or in `app/_hooks/`.

**Examples:**

- `useLocalStorage` — syncs React state with `localStorage` via `useState` + `useEffect`
- `useNetwork` — derives `devnetPort`, `config`, `addressPrefix`, and provider availability via `useMemo`

**References:**

- [`apps/web/app/_hooks/useLocalStorage.tsx`](apps/web/app/_hooks/useLocalStorage.tsx)
- [`apps/web/app/_hooks/useNetwork.tsx`](apps/web/app/_hooks/useNetwork.tsx)

> A component that mixes pagination state, form validation, and canvas coordinate math should extract each concern into its own hook.

## 3. Type Ownership

All provider-related types belong in `packages/provider-core/src/index.ts`. Never duplicate `Tx`, `UTxO`, `BlockMetadata`, etc. in app or provider packages. UI-specific types can live next to the component if they're not reusable.

**Reference:** [`packages/provider-core/src/index.ts`](packages/provider-core/src/index.ts)

- `BlockMetadata`, `PaginatedRequest`, `PaginatedResult`, `ChainProvider`, and all request/response shapes are defined once here
- Provider implementations import these types instead of re-declaring them
- `TxRow.tsx` imports `cardano.Tx` from `@laceanatomy/types` — it does not redefine its own transaction shape

## 4. Sensitive Data

Base URLs, API keys, and node endpoints must **never** be hardcoded.

- Server-side config flows through `getNetworkConfigServer(chain)`
- Client-side config (devnet port) flows through user settings
- Environment variables are the **only** source of secrets

**Reference:** [`apps/web/server/api/dolos-provider.ts`](apps/web/server/api/dolos-provider.ts)

```ts
const {
  dolosBlockfrostUrl,
  dolosBlockfrostApiKey,
  dolosUtxorpcUrl,
  dolosUtxorpcApiKey,
  addressPrefix,
} = getNetworkConfigServer(chain);
```

> Notice that the Dolos provider does not contain a single literal URL or key. Everything is injected from the server config, which in turn reads from environment variables.

## 5. Server/Client Boundary

- Data fetching happens **server-side**: route handlers, server components, tRPC
- Interactivity happens **client-side**: accordions, pagination clicks, modals
- Never import server-only modules (e.g., `server/api/*`) into client components
- Use `Suspense` and streaming for async server data

**Reference:** [`apps/web/app/_components/GraphicalSection/InfoPanel/TxInfo.tsx`](apps/web/app/_components/GraphicalSection/InfoPanel/TxInfo.tsx)

- `TxInfo` is a client component (`"use client"`) that uses Heroui `Accordion`, `useDisclosure`, and `useState` for interactivity
- It does **not** fetch raw transaction data directly; it consumes already-loaded data from context
- The actual provider instantiation and secret handling live in server-side files like `dolos-provider.ts`

> If a component needs to fetch data, use a server component, a tRPC query, or a route handler — not a `useEffect` inside a client component.

## 6. Styling Conventions

- Use **Tailwind CSS** utility classes exclusively
- Use **Heroui** components (`Card`, `Accordion`, `Button`, etc.) for common UI primitives
- No inline styles, no CSS-in-JS, no custom CSS files for one-off components
- Theme tokens come from the Tailwind config (e.g., `bg-surface`, `text-p-secondary`)

**References:**

- [`apps/web/app/_components/ExplorerSection/Transactions/TxRow.tsx`](apps/web/app/_components/ExplorerSection/Transactions/TxRow.tsx) — uses `bg-explorer-row`, `text-accent-blue`, `border-border`
- [`apps/web/app/_components/GraphicalSection/InfoPanel/TxInfo.tsx`](apps/web/app/_components/GraphicalSection/InfoPanel/TxInfo.tsx) — uses Heroui `Accordion`, `Card`, `Button`, `Input`
- [`apps/web/tailwind.config.ts`](apps/web/tailwind.config.ts) — defines `background`, `surface`, `p-primary`, `accent-blue`, `explorer-row`, etc.

> If you find yourself writing `style={{ marginTop: '8px' }}`, replace it with `mt-2`. If you need a reusable style pattern, add a Tailwind class or component wrapper, not a CSS module.
