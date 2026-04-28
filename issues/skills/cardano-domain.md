# Create Skill: Cardano Domain Types & CBOR

> **good first issue** — This issue is beginner-friendly and a great way to understand the type system that underpins the entire app.

## Goal
Create a repository skill (`.agents/skills/cardano-domain/SKILL.md`) that documents the Cardano-specific types, branded types, and the CBOR parsing pipeline in `cardano-graphical-tx`.

## Scope

The skill should cover:

### 1. Branded Types
We use opaque/branded types to prevent mixing up hex strings:
- `Hash` — 32-char hex string
- `Address` — hex or bech32, normalized to hex
- `Unit` — concatenated policy + asset name hex, or `'lovelace'`
- `HexString` — arbitrary hex string

These are created via constructor functions that validate input, not just type aliases.

### 2. Core Domain Model
- `UTxO` — `{ outRef, address, coin, value, datum?, consumedBy? }`
- `Tx<U>` — `{ hash, fee, mint, inputs, outputs, referenceInputs, metadata?, block }`
- `Block<U, T>` — `{ header, txs }`
- `Value` — `Record<Unit, bigint>`
- `Mint` — alias for `Value`

### 3. Cardano Extensions
- `CardanoTxFields` — adds `treasuryDonation`, `createdAt`, `witnesses`, `validityInterval`, `indexInBlock`
- `CardanoBlockFields` — adds `epochNo`
- `Redeemer`, `Script`, `ScriptType`, `RdmrPurpose`

### 4. The CBOR Pipeline
- Raw CBOR hex → `napi-pallas` (Rust NAPI module) → parsed JSON → mapped to `cardano.Tx`
- `packages/napi-pallas` must be built before the web app
- Next.js config externalizes `.node` files via `serverComponentsExternalPackages`

### 5. Type Relationships
- `Cardano = BaseChain<CardanoUTxO, CardanoTx>`
- `DolosProvider` and `U5CProvider` both implement `ChainProvider<CardanoUTxO, CardanoTx, Cardano>`
- This generic design allows future multi-chain support

## Related files to reference
- `packages/types/src/utxo-model.ts`
- `packages/types/src/cardano/index.ts`
- `packages/napi-pallas/`
- `apps/web/next.config.js` (`.node` externalization)

## Acceptance Criteria
- [ ] Skill file created at `.agents/skills/cardano-domain/SKILL.md`
- [ ] Documents all 4 branded types with validation rules
- [ ] Explains the `Tx` / `UTxO` / `Block` hierarchy
- [ ] Describes the CBOR → `napi-pallas` → TypeScript pipeline
- [ ] Mentions the generic `ChainProvider` relationship

## Related
- `issues/skills/provider-core.md`
- `issues/explorer-block-scroll/01-provider-getBlocksWithTxs.md`
