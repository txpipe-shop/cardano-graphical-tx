# 03 — Address Detail Page

> **good first issue** — This issue is beginner-friendly and reuses existing address dissection components.

## Summary

Add an address detail page at `/explorer/[chain]/addresses/[address]` showing address dissection, UTxO list, and transaction history.

## Motivation

The explorer currently has no address-level view. Users need to inspect an address's structure, balance, UTxOs, and transaction history. The dissection data is already available via `napi-pallas` (`getAddressInfo`), and on-chain data is available via `ChainProvider`.

## Proposed Design

### Route

```
/explorer/[chain]/addresses/[address]
```

### Page: `app/explorer/[chain]/addresses/[address]/page.tsx`

Server component.

### Data loading

**Eager (page level):** Only fetch what the overview card and default tab need.
```ts
const funds = await provider.getAddressFunds({ address });
const addressInfo = await getAddressInfo(address);
```

**Deferred (tab level):** UTxOs and transactions are fetched inside async components wrapped in `<Suspense>`. This keeps the initial HTML small and streams tab content as it resolves.

### Tabs

Uses `DetailTabs` (from `explorer-block-scroll` / `02-blocks-list-and-detail`).

| Tab | Default? | Loading Strategy |
|-----|----------|------------------|
| **Dissect** | **Yes** | Eager — server-rendered immediately |
| **UTxOs** | No | Deferred — server-fetched inside `<Suspense>` boundary |
| **Transactions** | No | Deferred — server-fetched inside `<Suspense>` boundary |

#### Dissect tab (default)

Reuses existing address dissection components from `app/_components/AddressSection/`:

```tsx
import { getAddressInfo } from "~/app/_utils";
import { ShelleySection, StakeSection, ByronSection } from "~/app/_components";

const addressInfo = await getAddressInfo(address);

<>
  {addressInfo?.kind === "Shelley" && <ShelleySection data={addressInfo} />}
  {addressInfo?.kind === "Stake" && <StakeSection data={addressInfo} />}
  {addressInfo?.kind === "Byron" && <ByronSection data={addressInfo} />}
</>
```

These components handle:
- Shelley address breakdown (network ID, payment part, delegation part)
- Stake address breakdown
- Byron legacy address breakdown
- Hex bytes, Bech32 decoding, property blocks with color coding

The components are pure presentation and fit directly into the tab panel. No styling changes needed.

#### UTxOs tab (deferred)

Create `app/explorer/[chain]/addresses/[address]/_components/AddressUTxOsList.tsx` as an **async server component** that calls `provider.getAddressUTxOs(...)`. The parent page wraps it in:

```tsx
<Suspense fallback={<UTxOsSkeleton />}>
  <AddressUTxOsList address={address} chain={chain} />
</Suspense>
```

- Each row: OutRef (hash truncated + #index), Value (ADA + TokenPills), Datum badge (if present)
- Skeleton shown while streaming

#### Transactions tab (deferred)

Create `app/explorer/[chain]/addresses/[address]/_components/AddressTxList.tsx` as an **async server component** that calls `provider.getTxs(...)`. Wrapped in `<Suspense fallback={<TxTableSkeleton />}>`.

- Reuses `TxTable` with address highlighting for relevant I/Os
- Each row shows whether this address was input, output, or both

### Address overview card (above tabs)

```
┌───────────────────────────────────────────────┐
│ Address: addr1qxyz...                 [Copy]  │
│ Type: Payment (Shelley)               [Badge] │
│ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ Total Value          │ │ Transaction Count│ │
│ │ ADA: 1,234.56 ₳      │ │ 42               │ │
│ │ +3 TokenPills        │ │                  │ │
│ ├──────────────────────┤ ├──────────────────┤ │
│ │ First Seen           │ │ Last Seen        │ │
│ │ Block 12345          │ │ Block 56789      │ │
│ │ Slot 98765432        │ │ Slot 12345678    │ │
│ └──────────────────────┘ └──────────────────┘ │
├───────────────────────────────────────────────┤
│ [Dissect] [UTxOs (20)] [Transactions (42)]    │
├───────────────────────────────────────────────┤
│ Tab content                                   │
└───────────────────────────────────────────────┘
```

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

- `<DetailTabs>` — tab shell (from `02-blocks-list-and-detail`)
- `<ShelleySection>` / `<StakeSection>` / `<ByronSection>` — dissection views
- `<TxTable>` — transactions tab
- `<TokenPill>` — value display
- `<CopyButton>` — address copy
- `<ColoredAddress>` — header address display
- `<Pagination>` — for lazy-loaded UTxOs and txs

### ADA Handle resolution

If the route param looks like a handle (`$handle`), resolve it to an address (see #13) and redirect to the address page.

## Acceptance Criteria

- [ ] `/explorer/[chain]/addresses/[address]` renders for all 4 networks
- [ ] **Dissect tab is the default tab**
- [ ] Dissect tab shows address structure via `ShelleySection` / `StakeSection` / `ByronSection`
- [ ] UTxOs tab streams via Suspense with skeleton fallback
- [ ] Transactions tab streams via Suspense with skeleton fallback
- [ ] No `useEffect` data fetching in tab components
- [ ] Address overview card shows total value, tx count, first/last seen
- [ ] Address normalization handles hex/bech32/base58 inputs
- [ ] Address type badge shown
- [ ] Empty state for addresses with no activity
- [ ] Error state for invalid addresses
- [ ] ISR revalidate = 10 for server-rendered data
- [ ] Devnet addresses work via U5CProvider

## Dependencies

- `02-blocks-list-and-detail` — for `DetailTabs` component
- Uses existing `getAddressInfo` from `napi-pallas`
- Uses existing `getAddressFunds`, `getAddressUTxOs`, `getTxs` from `ChainProvider`
- `#01-a` (optional — for token metadata lookup when displaying TokenPills)
- #09 (search bar — for address search)
- #13 (ADA Handle — for handle-to-address resolution)

## Dependents

- #08 (status bar nav link)
- #09 (smart search redirects to this page)

## Notes

- The `ShelleySection` / `StakeSection` / `ByronSection` components are pure presentation components from `app/_components/AddressSection/`. They require no changes and fit directly into the tab panel.
- **Pattern to replicate:** All future tabbed pages (token detail, governance, pools) should use this same Suspense/async-component pattern instead of client-side `useEffect` fetching.
