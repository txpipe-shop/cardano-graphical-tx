# 02 — Define Chain-Specific Component Override Slots

## Summary

Design and implement the `ChainUIComponents` interface and the slot resolution mechanism that allows each chain to provide custom React components for chain-specific UI sections.

## Motivation

Chain-specific detail views cannot be generic. Cardano needs CBOR decoding, redeemers, scripts, and datum display. Bitcoin needs SegWit witness display and script types. Midnight needs SCALE decoding. A single generic component for all chains would be impossibly complex and unmaintainable. Instead, the explorer shell handles the generic chrome (header, pagination, search, layout) and delegates chain-specific detail views to per-chain components through a slot system.

## Proposed Design

### Slot definition

Define `ChainUIComponents` as a record of optional component types. Each slot corresponds to a section of the explorer UI that varies by chain. If a chain doesn't provide a slot, that section is hidden or shows a simple fallback.

### Slots

| Slot | Purpose | Required? |
|------|---------|-----------|
| `TxOverview` | Tx summary card (hash, fee, age, inputs/outputs count, chain-specific fields) | Yes (has default) |
| `TxScripts` | Witness scripts & redeemers detail | No — hidden if absent |
| `TxDatum` | Datum display | No — hidden if absent |
| `TxEncoding` | Raw byte encoding display (CBOR for Cardano, SCALE for Midnight, hex for Bitcoin) | No — hidden if absent |
| `TxStructure` | Structure tree / dissect view | No — hidden if absent |
| `AddressView` | Address format diagnostics & parsing | No — shows raw hex if absent |
| `ValueDisplay` | Multi-asset / token value rendering | Yes (has default) |
| `BlockOverview` | Block detail card | No — uses generic fallback |

### Default fallbacks

Each slot has a simple default component that shows raw data when a chain doesn't provide a custom one:

- **TxOverview**: Shows hash, fee, inputs/outputs count from `BaseTx`
- **ValueDisplay**: Shows `Record<string, bigint>` as a simple table
- **AddressView**: Shows raw address string

### Integration point

The explorer layout resolves the chain from the route, looks up `ChainUIComponents`, and passes them down via React context or props to the page components. Each page component renders:

```tsx
function TxDetailPage({ chain, tx }) {
  const TxOverview = chain.components.TxOverview ?? DefaultTxOverview;
  const TxScripts = chain.components.TxScripts;
  const TxEncoding = chain.components.TxEncoding;

  return (
    <div>
      <TxOverview tx={tx} chain={chain} />
      {TxScripts && chain.features.hasScripts && <TxScripts tx={tx} chain={chain} />}
      {TxEncoding && chain.features.hasCBOR && <TxEncoding tx={tx} chain={chain} />}
    </div>
  );
}
```

## Acceptance Criteria

- [ ] `ChainUIComponents` interface defined with all 8 slots
- [ ] Default fallback components created for `TxOverview`, `ValueDisplay`, `AddressView`
- [ ] Slot resolution utility that returns the chain-specific component or the default
- [ ] Feature flags correctly gate which slots are rendered
- [ ] Current Cardano explorer still works when wired through the slot system
- [ ] Component interface is not coupled to `cardano.Tx` — uses a generic `unknown` that gets cast per-chain

## Dependencies

- #01 (`ChainDescriptor` type)

## Dependents

- #05 (TxTable/TxRow refactor)
- #06 (TxTabs as chain-driven tab registry)
- #07 (Cardano AddressView)
- #08 (Cardano ValueDisplay)
