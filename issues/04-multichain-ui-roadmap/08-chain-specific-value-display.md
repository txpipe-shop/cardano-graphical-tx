# 08 — Create Chain-Specific Value/Token Display Components

## Summary

Extract the Cardano-specific multi-asset value rendering (`TokenPill`, lovelace formatting) into a chain-specific `ValueDisplay` slot with a generic fallback.

## Motivation

Value representation is chain-specific:

- **Cardano**: Multi-asset `Value` (`Record<Unit, bigint>`). lovelace (ADA) as the base unit, plus native tokens identified by policy ID + asset name hex. `TokenPill` renders them as colored badges with CIP-14 fingerprints.
- **Bitcoin**: Single-asset (BTC/satoshis only). Simple number formatting. No token badges.
- **Midnight**: Dust (its own token). Possibly multi-asset. Different token identifiers.
- **Hydra**: Same as Cardano.

Current code:
- `TokenPill.tsx` — imports `fingerprintFromUnit` from `@laceanatomy/types` (Cardano-specific policy+asset parsing)
- `explorer.ts` — `normalizeAddress` uses `hexToBech32` (Cardano-specific)

## Proposed Design

### `ValueDisplay` slot component

```ts
// In ChainUIComponents
ValueDisplay?: ComponentType<{
  value: Value;                      // Record<Unit, bigint> (generic from utxo-model)
  chain: ChainDescriptor;
  compact?: boolean;                 // Compact inline mode for tables
  maxVisible?: number;               // Max assets to show before "+N more"
}>;
```

### Generic fallback

```tsx
function DefaultValueDisplay({ value, compact }: { value: Value; compact?: boolean }) {
  if (compact) {
    const total = Object.values(value).reduce((a, b) => a + b, 0n);
    return <span className="font-mono">{String(total)}</span>;
  }
  return (
    <ul>
      {Object.entries(value).map(([unit, amount]) => (
        <li key={unit}>
          <span className="font-mono">{String(amount)}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </li>
      ))}
    </ul>
  );
}
```

### Cardano-specific `ValueDisplay`

The existing `TokenPill` and lovelace formatting move into `CardanoValueDisplay`:

```tsx
function CardanoValueDisplay({ value, chain, compact, maxVisible }: ValueDisplayProps) {
  // Separate lovelace from multi-assets
  const lovelace = value['lovelace'] ?? 0n;
  const assets = Object.entries(value).filter(([u]) => u !== 'lovelace');

  return (
    <div>
      <LovelaceDisplay amount={lovelace} />
      {!compact && assets.map(([unit, amount]) => (
        <TokenPill key={unit} unit={unit} amount={amount} />
      ))}
    </div>
  );
}
```

## Acceptance Criteria

- [ ] `CardanoValueDisplay` extracted from `TokenPill` + lovelace formatting
- [ ] `DefaultValueDisplay` generic fallback implemented
- [ ] `ValueDisplay` slot registered in all Cardano chain descriptors
- [ ] Explorer tx rows, tx overview, and block pages use chain-aware `ValueDisplay`
- [ ] Compact vs full mode works (compact for table cells, full for detail pages)
- [ ] Asset name resolution (CIP-14 fingerprints) stays within Cardano-specific code
- [ ] Bitcoin value display shows simple BTC/satoshi formatting
- [ ] No regressions in existing Cardano token display

## Dependencies

- #01 (`ChainDescriptor`)
- #02 (component slots interface)

## Dependents

- #05 (TxTable/TxRow uses `ValueDisplay` in fee and amount columns)
