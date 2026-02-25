# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cardano-tx-graphic** (internal name: `laceanatomy`) is a monorepo webapp for visualizing Cardano transactions and dissecting CBOR data. It supports multiple Cardano data backends and renders transactions as interactive canvas graphics.

## Commands

All commands use **pnpm** as the package manager. Run from the repo root unless specified.

### Root (Turbo-orchestrated)
```bash
pnpm run build       # Build all packages and apps
pnpm run dev         # Start all dev servers concurrently
pnpm run lint        # Lint all packages and apps
pnpm run check       # TypeScript check across workspace
pnpm run format      # Prettier format everything
pnpm run clean       # Remove node_modules, dist, build, .next, .turbo, .vite, target
```

### apps/web (Next.js 14)
```bash
pnpm --filter cardano-graphical-tx dev     # Start Next.js dev server
pnpm --filter cardano-graphical-tx build   # Build Next.js app
pnpm --filter cardano-graphical-tx lint    # ESLint + Next.js lint
pnpm --filter cardano-graphical-tx check   # tsc --noEmit
```

### apps/api (Fastify)
```bash
pnpm --filter api dev    # tsx --watch src/server.ts
pnpm --filter api build  # tsc (outputs to dist/)
pnpm --filter api start  # node dist/server.js
```

### apps/svelte-app (SvelteKit)
```bash
pnpm --filter @laceanatomy/web dev     # vite dev
pnpm --filter @laceanatomy/web build   # vite build
pnpm --filter @laceanatomy/web check   # svelte-check
```

### packages/napi-pallas (Rust NAPI module — must be built before other packages)
```bash
cd packages/napi-pallas
pnpm run build        # napi build --platform --release (requires Rust/Cargo)
pnpm run build:debug  # debug build
pnpm run test         # ava
pnpm run lint         # oxlint
```

### packages/cardano-provider-dbsync
```bash
pnpm --filter @laceanatomy/cardano-provider-dbsync test          # vitest run
pnpm --filter @laceanatomy/cardano-provider-dbsync test:perf     # vitest run test/perf.test.ts
pnpm --filter @laceanatomy/cardano-provider-dbsync coverage      # vitest run --coverage
```

Note: The `cardano-provider-dbsync` build copies SQL files to `dist/sql/queries/` in addition to running `tsc`.

## Architecture

### Monorepo Structure
- **`apps/web`** — Primary Next.js 14 frontend with App Router, tRPC, canvas-based tx visualization
- **`apps/api`** — Fastify REST API with Swagger docs, uses DBSync and token registry
- **`apps/svelte-app`** — Alternative SvelteKit frontend with identical visualization capabilities
- **`packages/`** — Shared libraries (see Provider System below)

### Provider System
The core architectural pattern is a pluggable provider abstraction for Cardano data:

- **`packages/provider-core`** — Base provider interface/abstractions
- **`packages/cardano-provider-dbsync`** — PostgreSQL DB Sync backend
- **`packages/cardano-provider-u5c`** — UTxO RPC (gRPC) backend
- **`packages/cardano-provider-dolos`** — Dolos node backend
- **`packages/blockfrost-sdk`** — Blockfrost REST API wrapper
- **`packages/utxorpc-sdk`** — UTxO RPC SDK
- **`packages/types`** — Shared TypeScript types across all packages
- **`packages/cardano-token-registry-sdk`** — Token metadata registry

In `apps/web`, providers are instantiated server-side in `server/api/` (`dbsync-provider.ts`, `u5c-provider.ts`) and the active network/provider is configured via environment variables.

### napi-pallas (Rust Native Module)
`packages/napi-pallas` is a Rust crate using napi-rs to expose Pallas (Cardano Rust library) functionality to Node.js. It **must be built before** the web app and other packages that depend on it. The Next.js config externalizes it from webpack bundling (handled via `serverComponentsExternalPackages` and `.node` file loader).

### Next.js App Structure (`apps/web`)
- `app/` — App Router pages: `/tx` (transaction visualizer), `/address`, `/explorer/[chain]`
- `app/_components/` — Shared React components including `GraphicalSection`, `DissectSection`, `AddressSection`, `ExplorerSection`
- `app/_contexts/` — React context providers
- `app/_hooks/` — Custom React hooks
- `app/api/` — Route handlers; `_handlers/` contains `cbor.handler.ts`, `hash.handler.ts`, `address.handler.ts`
- `server/api/` — Server-side provider instantiation (not route handlers)

### Visualization
Both apps use **Konva.js** for canvas-based transaction rendering (react-konva in Next.js, svelte-konva in SvelteKit). Transactions are parsed from CBOR via the napi-pallas native module and rendered as interactive node graphs.

## Environment Setup

Copy `apps/web/.env.example` to `apps/web/.env` and configure:
- `DATABASE_URL` / `DIRECT_URL` — PostgreSQL connection for DB Sync provider
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth (NextAuth)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth (NextAuth)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL`
- `MAINNET_BLOCKFROST_KEY`, `PREPROD_BLOCKFROST_KEY`, `PREVIEW_BLOCKFROST_KEY`
- `NEXT_PUBLIC_GA_TRACKING_ID` (optional)

## Code Style

- **Prettier**: single quotes, no trailing commas, print width 100, plugins: svelte + tailwindcss
- **Package manager**: pnpm (v9.15.0 at root; napi-pallas uses v10)
- **Module system**: ESM throughout
- **TypeScript**: strict mode, ES2022 target, bundler module resolution
