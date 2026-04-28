# Create Skill: Provider Core Abstractions

> **good first issue** — This issue is beginner-friendly and essential for anyone adding new provider methods or creating new providers.

## Goal
Create a repository skill (`.agents/skills/providers/SKILL.md`) that documents the `ChainProvider` interface, type algebra, and provider conventions in `cardano-graphical-tx`.

## Scope

The skill should cover:

### 1. Type ownership
- **All provider-related types live in `packages/provider-core/src/index.ts`**
- Never duplicate `TxsReq`, `BlocksRes`, `BlockMetadata`, etc. in consumer packages
- If you need a new type, add it to `provider-core` and re-export

### 2. The `ChainProvider` interface
- Generic over `U extends UTxO`, `T extends Tx<U>`, `Chain extends BaseChain<U, T>`
- Required methods: `getTxs`, `getBlocks`, `getBlock`, `getLatestTx`, `readTip`, etc.
- Optional methods: `getPools`, `getPool`, `getBlocksWithTxs`

### 3. Pagination models
- `PaginatedRequest<T>`: `{ limit: bigint; offset?: bigint; query: T }`
- `CursorPaginatedRequest<T>`: `{ cursor?: string; limit: bigint; query: T }`
- When to use each: offset for stable ordering (Blockfrost), cursor for chain traversal (UTxORPC `DumpHistory`)

### 4. Adding a new provider method
- Add the request/response types to `provider-core`
- Make the method optional on `ChainProvider` if not all backends can support it
- Implement in `DolosProvider` and `U5CProvider`
- `DbSyncProvider` can throw `NotImplemented` or be skipped

### 5. Provider instantiation
- Server-side: `getDolosProvider(chain)` uses `getNetworkConfigServer(chain)`
- Client-side (devnet): `getU5CProviderWeb(port)` creates a web transport
- Never instantiate providers directly in UI components

## Related files to reference
- `packages/provider-core/src/index.ts`
- `packages/cardano-provider-dolos/src/index.ts`
- `packages/cardano-provider-u5c/src/index.ts`
- `apps/web/server/api/dolos-provider.ts`
- `apps/web/app/_utils/u5c-provider-web.ts`

## Acceptance Criteria
- [ ] Skill file created at `.agents/skills/providers/SKILL.md`
- [ ] Explicitly states the "types live in provider-core" rule
- [ ] Documents both pagination models with use cases
- [ ] Explains the optional method pattern for backward compatibility
- [ ] Shows where and how providers are instantiated

## Related
- `issues/skills/utxorpc.md`
- `issues/skills/blockfrost-sdk.md`
- `issues/explorer-block-scroll/01-provider-getBlocksWithTxs.md`
