# Create Skill: Blockfrost SDK Usage

> **good first issue** — This issue is beginner-friendly and a great way to understand the hybrid provider model.

## Goal
Create a repository skill (`.agents/skills/blockfrost-sdk/SKILL.md`) that documents when and how to use the internal Blockfrost SDK wrapper in `cardano-graphical-tx`.

## Scope

The skill should cover:

### 1. When to use Blockfrost vs UTxORPC
- Blockfrost is RESTful and good for metadata, epochs, pools, and address lookups
- UTxORPC is gRPC and good for block bodies, resolved transactions, and real-time sync
- `DolosProvider` is a hybrid: it uses both

### 2. Internal wrapper
- We don't call Blockfrost directly; we use `@laceanatomy/blockfrost-sdk`
- This is an internal package that wraps the official Blockfrost API with our types

### 3. Common endpoints used
- `blocksLatestGet` — tip discovery
- `blocksHashOrNumberGet` — block metadata by hash or height
- `blocksHashOrNumberTxsGet` — tx hashes in a block
- `addressesAddressTransactionsGet` — tx history for an address

### 4. Pagination
- Blockfrost uses count/page pagination
- Page 1 is the first page (not 0-indexed)
- Order can be `asc` or `desc`

### 5. Provider integration
- How `DolosProvider` decides which backend to use for which method
- Example: `getBlocks` uses Blockfrost, `getBlocksWithTxs` uses UTxORPC `DumpHistory`

## Related files to reference
- `packages/blockfrost-sdk/`
- `packages/cardano-provider-dolos/src/index.ts`
- `packages/cardano-provider-dolos/src/mappers.ts`

## Acceptance Criteria
- [ ] Skill file created at `.agents/skills/blockfrost-sdk/SKILL.md`
- [ ] Clearly explains when to prefer Blockfrost over UTxORPC
- [ ] Lists the 4 common endpoints with their use cases
- [ ] Explains the count/page pagination model
- [ ] Describes the hybrid provider pattern with concrete examples

## Related
- `issues/skills/utxorpc.md`
- `issues/skills/provider-core.md`
