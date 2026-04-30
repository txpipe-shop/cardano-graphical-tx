# AGENTS.md

## Build prerequisites

- **pnpm** (v9.15.0 at root; napi-pallas uses its own v10.27.0 — the workspace handles this)
- **Rust/Cargo** — required to build `packages/napi-pallas` (napi-rs native module wrapping Pallas)
- Node >= 18

## Build order

**`packages/napi-pallas` must be built before anything that depends on it**, including `apps/web` and `packages/cardano-provider-dbsync`. Turbo's `^build` dependency handles this, but the first build in a fresh clone will fail without Rust.

```bash
pnpm install
pnpm --filter @laceanatomy/napi-pallas build   # first, or let turbo handle it
pnpm build                                       # builds everything
```

## Key commands

```bash
pnpm build          # turbo run build (all packages + apps)
pnpm dev            # turbo run dev (all dev servers in parallel)
pnpm lint           # turbo run lint
pnpm check          # turbo run check (type-check across workspace)
pnpm format         # prettier --write .
pnpm clean          # removes node_modules, dist, build, .next, .turbo, .vite, target
```

### Per-package commands

```bash
# apps/web (Next.js 14) — filter name is "cardano-graphical-tx"
pnpm --filter cardano-graphical-tx dev
pnpm --filter cardano-graphical-tx build
pnpm --filter cardano-graphical-tx lint

# apps/svelte-app (SvelteKit) — filter name is "@laceanatomy/web"
pnpm --filter @laceanatomy/web dev
pnpm --filter @laceanatomy/web build
pnpm --filter @laceanatomy/web check    # svelte-check (NOT tsc)

# apps/api (Fastify)
pnpm --filter api dev
pnpm --filter api build

# packages/napi-pallas (Rust NAPI) — RUN FROM ITS DIRECTORY
cd packages/napi-pallas && pnpm build
cd packages/napi-pallas && pnpm test    # ava

# packages/cardano-provider-dbsync — the only package with real tests
pnpm --filter @laceanatomy/cardano-provider-dbsync test
pnpm --filter @laceanatomy/cardano-provider-dbsync test:perf
```

## Test reality

Most packages and apps have **no real tests**. Only these have working test suites:

- `packages/cardano-provider-dbsync` — vitest (requires PostgreSQL)
- `packages/napi-pallas` — ava (requires the native build)

Do not add test commands that don't exist.

## Non-obvious build steps

- **`cardano-provider-dbsync` build copies SQL files** after tsc: `mkdir -p dist/sql/queries && cp src/sql/queries/*.sql dist/sql/queries/`
- **napi-pallas browser field** points to `browser.js` — a stub. The `.node` native binary is server-only.
- **`SKIP_VALIDATION=1`** is set in CI (and turbo.json `build` task env) to skip validation during builds.

## Webpack config in `apps/web/next.config.mjs`

- `canvas` is externalized for Konva/konva-react
- `@connectrpc/connect-node` is externalized for client bundles (browser can't use it)
- `.node` files use `nextjs-node-loader`
- napi-pallas warning suppression: Critical dependency and Can't resolve warnings are ignored

## Environment

Copy `apps/web/.env.example` → `apps/web/.env`. Main vars:

- `DATABASE_URL` / `DIRECT_URL` — PostgreSQL for DB Sync provider
- `NEXTAUTH_*` — NextAuth config
- `*_BLOCKFROST_KEY` — Blockfrost API keys per network

## Monorepo structure (quick reference)

```
apps/
  web/          Next.js 14 (App Router, tRPC) — filter: "cardano-graphical-tx"
  svelte-app/   SvelteKit — filter: "@laceanatomy/web"
  api/          Fastify REST API — filter: "api"
packages/
  napi-pallas/              Rust native module (build first)
  provider-core/            Base provider interface
  cardano-provider-dbsync/  PostgreSQL DB Sync backend
  cardano-provider-u5c/     UTxO RPC backend
  cardano-provider-dolos/   Dolos node backend
  types/                    Shared TypeScript types
  blockfrost-sdk/           Blockfrost REST API wrapper
  utxorpc-sdk/              UTxO RPC SDK
  cardano-token-registry-sdk/
  provider-tests/           Shared test utilities
  typescript-config/        Shared tsconfig base
```

## Code style

- **Prettier**: single quotes, no trailing commas, print width 100 (root `.prettierrc`; `apps/web` has its own `prettier.config.js` with organize-imports)
- **Module system**: ESM throughout
- **TypeScript**: strict mode, bundler resolution
- **No comments** unless necessary; prefer readable code

## See also

- `CLAUDE.md` — more detailed architecture and Next.js app structure
- Turbo config: `turbo.json`
- Workspace config: `pnpm-workspace.yaml`
