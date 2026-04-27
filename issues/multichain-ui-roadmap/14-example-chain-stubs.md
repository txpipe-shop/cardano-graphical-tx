# 14 — Add Example Chain Stubs (Bitcoin or Midnight)

## Summary

Add a minimal stub implementation for one non-Cardano chain (Bitcoin or Midnight) to validate the multi-chain architecture end-to-end, even without a real backend.

## Motivation

Without a second chain to test against, the multi-chain architecture is hypothetical. A stub chain implementation proves that:
- The chain registry can hold non-Cardano entries
- The provider factory can instantiate non-Cardano providers
- Component slots are properly isolated (Midnight doesn't accidentally render Cardano tabs)
- The routing works for non-Cardano chain IDs

## Which chain?

**Recommended: Midnight** — it's a UTxO-based chain (same fundamental model), but has different encoding (SCALE instead of CBOR), different address format (likely SS58-derived), and no stake pools. This provides the most contrast for testing slot isolation.

**Alternative: Bitcoin** — would test the abstraction because Bitcoin doesn't have UTxO datums, native tokens, or Plutus scripts. Address display is very different (SegWit types). But Bitcoin is not UTxO-based in the same way (no multi-asset, no datums, no reference inputs).

## Proposed Scope

### 1. Types (`packages/types/src/`)

Add to `chains.ts`:

```ts
export type MidnightUTxO = BaseUTxO & { /* minimal or empty extension */ };
export type MidnightTx = BaseTx<MidnightUTxO> & { /* minimal or empty extension */ };
export type Midnight = BaseChain<MidnightUTxO, MidnightTx>;
```

### 2. Chain descriptor (`app/_utils/chain-registry.ts`)

```ts
const midnightDevnet: ChainDescriptor = {
  id: 'midnight-devnet',
  name: 'Midnight Devnet',
  family: 'midnight',
  network: 'devnet',
  address: {
    defaultPrefix: 'mid',
    isValidAddress: (addr: string) => addr.startsWith('mid'),
  },
  features: {
    hasCBOR: false,      // Midnight uses SCALE
    hasScripts: true,     // Has ZK proofs as witnesses
    hasDatum: false,
    hasPools: false,      // No stake pools
    hasEpochs: false,
    hasMinting: false,
    hasGovernance: false,
    hasReferenceInputs: false,
  },
  components: {
    TxOverview: MidnightTxOverview,
    TxEncoding: MidnightTxScale,   // SCALE display instead of CBOR
    ValueDisplay: DefaultValueDisplay,
    // No TxDatum, TxScripts, TxStructure — those tabs won't render
  },
  txDetailTabs: [
    { key: 'overview', title: 'Overview', component: MidnightTxOverview },
    { key: 'diagram', title: 'Diagram', component: GraphicalTxSection },
    { key: 'scale',   title: 'SCALE',    component: MidnightTxScale },
  ],
  ui: {
    chainName: 'Midnight',
    txInputPlaceholder: 'Enter SCALE-encoded Midnight transaction',
    addressInputPlaceholder: 'Enter a Midnight address',
    networkDescription: 'Midnight Devnet',
  },
  providers: {
    default: { backend: 'mock', addressPrefix: 'mid' },
  },
};
```

### 3. Mock provider

A `MockProvider` that implements `ChainProvider<MidnightUTxO, MidnightTx, Midnight>` and returns empty results or mock data:

```ts
class MockProvider implements ChainProvider<MidnightUTxO, MidnightTx, Midnight> {
  async getCBOR(_: TxReq): Promise<string> { return ''; }
  async getLatestTx(): Promise<MidnightTx> { return mockTx; }
  async getAddressFunds(_: AddressFundsReq): Promise<AddressFundsRes> { return { value: {}, txCount: 0n }; }
  async getAddressUTxOs(_: AddressUTxOsReq): Promise<AddressUTxOsRes<MidnightUTxO>> { return { data: [], total: 0n }; }
  async getTx(_: TxReq): Promise<MidnightTx> { return mockTx; }
  async getTxs(_: TxsReq): Promise<TxsRes<MidnightUTxO, MidnightTx, Midnight>> { return { data: [], total: 0n }; }
  async getBlock(_: BlockReq): Promise<BlockRes> { return mockBlock; }
  async getBlocks(_: BlocksReq): Promise<BlocksRes> { return { data: [], total: 0n }; }
  async getEpoch(_: EpochReq): Promise<EpochRes> { throw new Error('No epochs'); }
  async getEpochs(_: EpochsReq): Promise<EpochsRes> { throw new Error('No epochs'); }
  async readTip(): Promise<TipRes> { return { hash: '0000...' as Hash, slot: 0n }; }
}
```

### 4. Stub UI components

Minimal components to exercise the slot system:

- `MidnightTxOverview` — shows "Midnight transaction" with mock data
- `MidnightTxScale` — shows "SCALE encoding not yet supported" placeholder

### 5. What NOT to do

- No real backend connection
- No real address parsing
- No real SCALE decoding
- The stub exists purely to validate the architecture

## Acceptance Criteria

- [ ] `MidnightUTxO`, `MidnightTx`, `Midnight` types defined in `packages/types/src/`
- [ ] `midnight-devnet` entry in chain registry
- [ ] `MockProvider` registered for midnight-devnet
- [ ] Stub UI components render placeholder content
- [ ] Navigating to `/explorer/midnight-devnet/txs` shows the stub tx list page
- [ ] Midnight tx detail page shows only 3 tabs (Overview, Diagram, SCALE) — not Cardano's 6 tabs
- [ ] Midnight address input uses midnight-specific placeholder
- [ ] Cardano explorer pages are unaffected
- [ ] TypeScript compilation passes

## Dependencies

- #01 through #13 (need the full multi-chain architecture working first)

## Dependents

- Provides validation that the architecture is correct before investing in real chain implementations
