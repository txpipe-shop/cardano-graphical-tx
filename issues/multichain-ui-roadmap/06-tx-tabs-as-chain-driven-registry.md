# 06 — Refactor TxTabs as Chain-Driven Tab Registry

## Summary

Replace the hardcoded tab list in `TxTabs` (Overview, Diagram, Dissect, CBOR, Datum, Scripts) with a tab registry driven by the chain descriptor. Each chain declares which tabs it supports and provides the component for each tab.

## Motivation

`TxTabs` currently renders a fixed set of tabs:

```tsx
const tabs = [
  { key: 'overview',   title: 'Overview',   component: <TxOverview .../> },
  { key: 'diagram',    title: 'Diagram',    component: <Playground .../> },
  { key: 'dissect',    title: 'Dissect',    component: <DissectSection .../> },
  { key: 'cbor',       title: 'CBOR',       component: <TxCbor .../> },
  { key: 'datum',      title: 'Datum',      component: <TxDatum .../> },
  { key: 'scripts',    title: 'Scripts',    component: <TxScripts .../> },
];
```

This set of tabs doesn't make sense for every chain:
- **Bitcoin**: No CBOR, no Datum, no Redeemers. Might want "Raw Hex" and "Script Types" tabs instead.
- **Midnight**: No CBOR. Might want "SCALE" tab.
- **Hydra**: Isomorphic transactions, subset of Cardano tabs.

## Proposed Design

### Tab declaration in chain descriptor

```ts
type TxTab = {
  key: string;
  title: string;
  component: ComponentType<{ tx: unknown; chain: ChainDescriptor }>;
  /** Hide this tab if the corresponding feature flag is false */
  requiresFeature?: keyof ChainDescriptor['features'];
};

// In ChainDescriptor:
interface ChainDescriptor {
  txDetailTabs: TxTab[];
  // ...
}
```

### Cardano's tab declaration

```ts
cardanoMainnet: {
  txDetailTabs: [
    { key: 'overview',  title: 'Overview',  component: CardanoTxOverview,  requiresFeature: undefined },
    { key: 'diagram',   title: 'Diagram',   component: GraphicalTxSection, requiresFeature: undefined },
    { key: 'dissect',   title: 'Dissect',   component: CardanoDissect,    requiresFeature: 'hasCBOR' },
    { key: 'cbor',      title: 'CBOR',      component: CardanoTxCbor,     requiresFeature: 'hasCBOR' },
    { key: 'datum',     title: 'Datum',     component: CardanoTxDatum,    requiresFeature: 'hasDatum' },
    { key: 'scripts',   title: 'Scripts',   component: CardanoTxScripts,  requiresFeature: 'hasScripts' },
  ],
}
```

### Bitcoin's tab declaration (future)

```ts
bitcoinMainnet: {
  txDetailTabs: [
    { key: 'overview',  title: 'Overview',  component: BitcoinTxOverview },
    { key: 'diagram',   title: 'Diagram',   component: GraphicalTxSection },
    { key: 'hex',       title: 'Raw Hex',   component: BitcoinTxHex },
    { key: 'witness',   title: 'Witnesses', component: BitcoinTxWitness, requiresFeature: 'hasScripts' },
  ],
}
```

### Tab component

```tsx
function TxTabs({ tx, chain }: { tx: unknown; chain: ChainDescriptor }) {
  const visibleTabs = chain.txDetailTabs.filter(tab => {
    if (tab.requiresFeature) return chain.features[tab.requiresFeature];
    return true;
  });

  return <HeroUITabs>
    {visibleTabs.map(tab => (
      <HeroUITab key={tab.key} title={tab.title}>
        <tab.component tx={tx} chain={chain} />
      </HeroUITab>
    ))}
  </HeroUITabs>;
}
```

### Tab types to extract from current code

| Current component | Becomes | File |
|-------------------|---------|------|
| `TxOverview.tsx` | `CardanoTxOverview` | `app/_components/ExplorerSection/Transactions/TxOverview.tsx` |
| `TxCbor.tsx` | `CardanoTxCbor` | `app/_components/ExplorerSection/Transactions/TxCbor.tsx` |
| `TxDatum.tsx` | `CardanoTxDatum` | `app/_components/ExplorerSection/Transactions/TxDatum.tsx` |
| `TxScripts.tsx` | `CardanoTxScripts` | `app/_components/ExplorerSection/Transactions/TxScripts.tsx` |
| `Playground.tsx` | `GraphicalTxSection` | Already generic (uses `ITransaction[]`) |

## Acceptance Criteria

- [ ] Tab list comes from `chain.txDetailTabs`, not hardcoded
- [ ] Tabs are filtered by feature flags (`requiresFeature`)
- [ ] Current Cardano tx detail page shows all 6 tabs identically
- [ ] New chains can declare their own tab sets
- [ ] If a chain declares zero tabs, the detail page still loads (shows raw data)
- [ ] Devnet variant (`DevnetTxTabs`) uses the same tab registry

## Dependencies

- #01 (`ChainDescriptor` with feature flags)
- #02 (component slots for tab contents)

## Dependents

- This is the main integration point for all tx detail components
