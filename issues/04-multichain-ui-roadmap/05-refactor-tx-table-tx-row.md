# 05 — Refactor TxTable and TxRow for Chain Slots

## Summary

Refactor `TxTable`, `TxRow`, and `TxSearch` to accept a generic transaction type and use chain-specific component slots for chain-specific inline rendering, instead of importing `cardano.Tx` directly.

## Motivation

`TxTable` and `TxRow` are the most reused components in the explorer. They currently:

```ts
// TxTable.tsx
import { type cardano } from '@laceanatomy/types';
function TxTable({ transactions }: { transactions: cardano.Tx[] }) { ... }

// TxRow.tsx
import { type cardano } from '@laceanatomy/types';
function TxRow({ tx, address }: { tx: cardano.Tx; address?: string }) { ... }
```

This hardcoding means every chain would need a completely separate table implementation. 
The table structure (hash column, age column, fee column, input/output counts, link to detail) is generic. Only a few inline details are chain-specific.

## Current state

| Column | Chain-specific? | Details |
|--------|:---:|---------|
| Hash (truncated) | No | All chains have tx hashes |
| Age / block time | No | All chains have timestamps |
| Fee | No | All chains have fees |
| Input count | No | All chains have inputs |
| Output count | No | All chains have outputs |
| Redeemer badges | **Yes** | Only Cardano |
| Mint/burn badges | **Yes** | Only multi-asset chains |
| Script inlines | **Yes** | Only chains with witnesses |
| Datum hashes | **Yes** | Only Cardano |

## Proposed Design

### Props

```ts
interface TxTableProps {
  transactions: unknown[];           // chain-erased at this level
  chain: ChainDescriptor;
  address?: string;                  // for highlighting relevant I/Os
  loading?: boolean;
  error?: string;
}
```

### Chain-specific rendering via slots

The table skeleton is generic. Chain-specific columns are rendered by a slot component:

```ts
// TxRow.tsx
function TxRow({ tx, chain, address }: { tx: unknown; chain: ChainDescriptor; address?: string }) {
  const Badges = chain.components.TxRowBadges;  // optional chain-specific badges
  return (
    <tr>
      <td><TxHash hash={extractHash(tx)} chain={chain} /></td>
      <td><TxAge time={extractTime(tx)} /></td>
      <td>{Badges && <Badges tx={tx} chain={chain} />}</td>
      <td><ValueDisplay value={extractFee(tx)} chain={chain} /></td>
      <td>{extractInputCount(tx)}</td>
      <td>{extractOutputCount(tx)}</td>
    </tr>
  );
}
```

### Extraction helpers

Chain-agnostic data extraction functions that work on the base `Tx` interface:

```ts
function extractHash(tx: unknown): string;
function extractTime(tx: unknown): number;
function extractFee(tx: unknown): Value;
function extractInputCount(tx: unknown): number;
function extractOutputCount(tx: unknown): number;
function extractBlock(tx: unknown): { hash: string; height: bigint; slot: bigint } | null;
```

These use the `BaseTx` fields that are guaranteed on every chain's tx type.

### New slot: `TxRowBadges`

Optional component slot that renders inline badges/indicators in the table row. Cardano provides one that shows:
- Script count badge (if tx has redeemers)
- Mint badge (if tx mints tokens)
- Datum count badge (if tx has datums)

Other chains can provide their own badges or none.

## Acceptance Criteria

- [ ] `TxTable` and `TxRow` accept `unknown` tx type and `ChainDescriptor`
- [ ] No `cardano.Tx` or `cardano.UTxO` imports in these files
- [ ] Generic extraction helpers for hash, time, fee, counts from `BaseTx` fields
- [ ] `TxRowBadges` slot renders chain-specific inline badges
- [ ] `address` prop still works for highlighting relevant I/Os
- [ ] Pagination still works
- [ ] Loading/error states still work
- [ ] Existing Cardano tx list renders identically

## Dependencies

- #01 (`ChainDescriptor`, `ChainUIComponents`)
- #02 (component slots interface)

## Dependents

- #03 (explorer data flow)
- #06 (TxTabs)
