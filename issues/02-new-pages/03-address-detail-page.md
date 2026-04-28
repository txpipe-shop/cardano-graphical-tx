# 03 — Address Detail Page

## Summary

Add an address detail page at `/explorer/[chain]/addresses/[address]` showing address overview (balance, tx count, first/last seen), UTxO list, and transaction history.

## Motivation

The explorer currently has no address-level view. Users need to inspect an address's balance, UTxOs, and transaction history. The data is already available via `ChainProvider.getAddressFunds()` and `ChainProvider.getAddressUTxOs()`, plus `getTxs({ query: { address } })` for transaction history.

## Proposed Design

### Route

```
/explorer/[chain]/addresses/[address]
```

### Page: `app/explorer/[chain]/addresses/[address]/page.tsx`

Server component.

### Data loading

```ts
const [funds, utxos, txHistory] = await Promise.all([
  provider.getAddressFunds({ address }),
  provider.getAddressUTxOs({ limit: 20n, offset: 0n, query: { address } }),
  provider.getTxs({ limit: EXPLORER_PAGE_SIZE, offset: 0n, query: { address } }),
]);
```

### Layout

```
┌──────────────────────────────────────────────┐
│ Address: addr1qxyz...                    [Copy]│
│ ┌──────────────────────┐ ┌─────────────────┐ │
│ │ Total Value          │ │ Transaction Count│ │
│ │ ADA: 1,234.56 ₳     │ │ 42              │ │
│ │ +3 TokenPills        │ │                 │ │
│ ├──────────────────────┤ ├─────────────────┤ │
│ │ First Seen           │ │ Last Seen       │ │
│ │ Block 12345          │ │ Block 56789     │ │
│ │ Slot 98765432        │ │ Slot 12345678   │ │
│ └──────────────────────┘ └─────────────────┘ │
├──────────────────────────────────────────────┤
│ [UTxOs (20)] [Transactions (42)]             │  ← tabs
├──────────────────────────────────────────────┤
│ UTxO list or Transaction list                 │
└──────────────────────────────────────────────┘
```

### Tabs

**1. UTxOs tab** (default)
- Paginated list similar to TxTable's input/output display
- Each row: OutRef (hash truncated + #index), Value (ADA + TokenPills), Datum badge (if present)

**2. Transactions tab**
- Reuses `TxTable` with `address` prop for highlighting relevant I/Os
- Each row shows whether this address was input, output, or both

### Address normalization

The page normalizes the address before querying (convert between hex, bech32, base58 as needed). Uses existing utilities from `_utils/string.ts` and `@laceanatomy/types/utils.ts`.

### Address type indicator

Show a badge indicating the address type:
- `Payment` (standard Shelley address)
- `Stake` (stake address)
- `Byron Legacy`
- Detection via `isBech32(addr)` / `isBase58(addr)` + prefix analysis

### Error handling

- Invalid address format → "Invalid Cardano address" error card
- Address not found → empty state with "No activity for this address"
- Provider failure → standard error card

### Component reuse

- `<TxTable>` — transactions tab
- `<TokenPill>` — value display
- `<CopyButton>` — address copy
- `<ColoredAddress>` — header address display
- `<Pagination>` — for both UTxOs and txs

### ADA Handle resolution

If the route param looks like a handle (`$handle`), resolve it to an address (see #13) and redirect to the address page.

## Acceptance Criteria

- [ ] `/explorer/[chain]/addresses/[address]` renders for all 4 networks
- [ ] Address overview card shows total value, tx count, first/last seen
- [ ] UTxOs tab lists UTxOs with pagination
- [ ] Transactions tab lists txs with pagination and address highlighting
- [ ] Address normalization handles hex/bech32/base58 inputs
- [ ] Address type badge shown
- [ ] Empty state for addresses with no activity
- [ ] Error state for invalid addresses
- [ ] ISR revalidate = 10 for server-rendered data
- [ ] Devnet addresses work via U5CProvider

## Dependencies

- Uses existing `getAddressFunds`, `getAddressUTxOs`, `getTxs` from `ChainProvider` (all providers implement these)
- #01 (optional — for token metadata lookup when displaying TokenPills)
- #09 (search bar — for address search)
- #13 (ADA Handle — for handle-to-address resolution)

## Dependents

- #08 (status bar nav link)
- #09 (smart search redirects to this page)
