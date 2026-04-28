# 01 — Create `ChainDescriptor` and Chain Registry

## Summary

Define a `ChainDescriptor` type that describes a chain at the UI level, and a registry that maps chain IDs to their descriptors. This is the foundation every other issue depends on.

## Motivation

Currently the explorer has no concept of "which chain am I displaying." The route param `[chain]` is just a Cardano network name (`mainnet`, `preprod`, `preview`, `devnet`). Every component imports `cardano.*` types directly. To support multiple chains (Bitcoin, Midnight, Hydra), we need a single source of truth that describes what a chain is, what features it has, and what providers are available.

## Proposed Design

### `ChainDescriptor` type

```ts
type ChainDescriptor = {
  /** Unique ID, e.g. "cardano-mainnet", "bitcoin-testnet" */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Chain family, e.g. "cardano", "bitcoin", "midnight" */
  family: string;
  /** Network within that family, e.g. "mainnet", "testnet" */
  network: string;
  /** Logo/icon component or URL */
  logo?: ComponentType | string;

  /** Address encoding configuration */
  address: {
    defaultPrefix: string;        // e.g. "addr" or "bc1"
    testPrefix?: string;          // e.g. "addr_test"
    /** Address validation pattern (regex or function) */
    isValidAddress: (addr: string) => boolean;
    /** Normalize an address string to a standard form */
    normalizeAddress?: (addr: string) => string;
  };

  /** Feature flags — what does this chain support? */
  features: {
    hasCBOR: boolean;           // Cardano-style CBOR serialization
    hasScripts: boolean;        // Has script/redeemer witness data
    hasDatum: boolean;          // Supports datum on UTxOs
    hasPools: boolean;          // Stake pool / validator set concept
    hasEpochs: boolean;         // Epoch-based consensus
    hasMinting: boolean;        // Multi-asset minting
    hasGovernance: boolean;     // On-chain governance/voting
    hasReferenceInputs: boolean;// Reference inputs (Cardano-specific)
  };

  /** Available UI components (chain-specific overrides) */
  components: ChainUIComponents;

  /** Available providers per network */
  providers: Record<string, ProviderConfig>;
};
```

### `ChainUIComponents` — per-chain component overrides

```ts
type ChainUIComponents = {
  /** Tx detail overview card */
  TxOverview?: ComponentType<{ tx: unknown; chain: ChainDescriptor }>;
  /** Scripts & redeemers display */
  TxScripts?: ComponentType<{ tx: unknown; chain: ChainDescriptor }>;
  /** Datum display */
  TxDatum?: ComponentType<{ tx: unknown; chain: ChainDescriptor }>;
  /** Raw encoding display (CBOR/SCALE/hex) */
  TxEncoding?: ComponentType<{ tx: unknown; chain: ChainDescriptor }>;
  /** Dissect / structure tree view */
  TxStructure?: ComponentType<{ tx: unknown; chain: ChainDescriptor }>;
  /** Address diagnostics view */
  AddressView?: ComponentType<{ address: string; chain: ChainDescriptor }>;
  /** Value / token display */
  ValueDisplay?: ComponentType<{ value: Value; chain: ChainDescriptor }>;
  /** Block overview card */
  BlockOverview?: ComponentType<{ block: unknown; chain: ChainDescriptor }>;
};
```

### Chain Registry

A `Map<ChainId, ChainDescriptor>` or a plain object keyed by chain ID. Exported from a shared location (e.g., `app/_utils/chain-registry.ts`). Starting entries:

- `cardano-mainnet`
- `cardano-preprod`
- `cardano-preview`
- `cardano-devnet`

### Chain-specific component resolution

```ts
function resolveComponent<K extends keyof ChainUIComponents>(
  chain: ChainDescriptor,
  slot: K
): ComponentType | null {
  return chain.components[slot] ?? null;
}
```

## Acceptance Criteria

- [ ] `ChainDescriptor` and `ChainUIComponents` types defined and exported
- [ ] Chain registry created with all 4 current Cardano networks
- [ ] Cardano networks wired up with correct feature flags and address config
- [ ] Component resolution utility working
- [ ] No runtime behavior change — existing explorer still works through the registry
- [ ] Types are strict enough that a new chain can't accidentally skip a required field

## Dependencies

None — this is the foundation.

## Dependents

All other issues depend on this one.
