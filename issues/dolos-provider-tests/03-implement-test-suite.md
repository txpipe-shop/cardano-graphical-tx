# Issue 03: Implement DolosProvider test suite

> **good first issue** — Follow the pattern from `cardano-provider-dbsync` and `cardano-provider-u5c`.

## Goal

Add tests to `packages/cardano-provider-dolos`. Currently it has zero test coverage.

## What exists already

Both `DbSyncProvider` and `U5CProvider` in this monorepo use `@laceanatomy/provider-tests` to run a shared correctness suite against Blockfrost as the golden reference. Look at their `test/` directories for the pattern:

- `packages/cardano-provider-dbsync/test/provider.test.ts`
- `packages/cardano-provider-u5c/test/provider.test.ts`
- `packages/cardano-provider-dbsync/test/perf.test.ts`

## What you need to create

- `test/setup.ts` — env validation for `DOLOS_U5C_URL`, `DOLOS_BF_URL`, `DOLOS_BF_API_KEY`, and `CHAIN`
- `test/provider.test.ts` — wire up `defineProviderSuite` with a `DolosProvider` instance
- `test/perf.test.ts` — wire up `definePerformanceSuite` (optional but nice)
- `test/vectors/mainnet.ts`, `preprod.ts`, `preview.ts` — hardcoded test vectors (see Issue 02)

## Rough approach

1. Add `vitest`, `@laceanatomy/provider-tests`, and `dotenv` to `devDependencies`
2. Add `test` / `test:perf` scripts to `package.json`
3. Create a DolosProvider instance in the test setup using env-configured UTxORPC transport + Blockfrost
4. Load the correct vector file based on the `CHAIN` env var
5. Pass vectors into `defineProviderSuite`

## Env vars needed

| Var | Purpose |
|-----|---------|
| `DOLOS_U5C_URL` | UTxORPC gRPC endpoint for the Dolos node |
| `DOLOS_BF_URL` | Blockfrost base URL for cross-checking |
| `DOLOS_BF_API_KEY` | Blockfrost project ID (optional) |
| `CHAIN` | `mainnet`, `preprod`, or `preview` |

## CI

Add a matrix job that runs tests for all 3 chains. Use repository secrets for URLs/keys.

## Acceptance Criteria

- [ ] `pnpm test` runs and passes in `packages/cardano-provider-dolos`
- [ ] Tests use hardcoded vectors when available, fall back to `getLatestTx()` otherwise
- [ ] CI matrix covers mainnet, preprod, preview
- [ ] `getBlocksWithTxs` is **not** in scope (doesn't exist yet)

## Related

- Issue 01: Test vector criteria
- Issue 02: Test vector lookup
- `packages/cardano-provider-dbsync/test/` (reference)
- `packages/cardano-provider-u5c/test/` (reference)
