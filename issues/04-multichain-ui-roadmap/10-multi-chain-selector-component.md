# 10 — Add Multi-Chain Selector Component

## Summary

Replace the current `ChainSelector` (a popover with four Cardano network options) with a two-level or flat chain selector that supports multiple chain families (Cardano, Bitcoin, Midnight, Hydra) and their networks.

## Motivation

The current `ChainSelector` component in `app/_components/ExplorerSection/ChainSelector.tsx` is a dropdown limited to Cardano networks:

```
mainnet | preprod | preview | devnet
```

Each is hardcoded with a Blockfrost endpoint and address prefix. To support multi-chain, users need to select both the chain family and the network within that family.

## Proposed Design

### Option A: Two-level dropdown

```
Chain: [Cardano    ▼]  Network: [Mainnet   ▼]
        ───────                       ──────
        Cardano                        Mainnet
        Bitcoin                        Preprod
        Midnight                       Preview
        Hydra                          Devnet
```

### Option B: Single flat list (Recommended for MVP)

```
Search or select a chain...

── Cardano ──
  ○ cardano-mainnet
  ○ cardano-preprod
  ○ cardano-preview
  ○ cardano-devnet
── Bitcoin ──
  ○ bitcoin-mainnet
  ○ bitcoin-testnet
```

### Component props

```ts
interface ChainSelectorProps {
  chains: ChainDescriptor[];   // from registry
  value: string;               // current chainId
  onChange: (chainId: string) => void;
  disabled?: boolean;
}
```

### Network availability indicators

The current `NetSelector` shows a green/red dot indicating if a gRPC devnet is reachable. This generalizes:

```ts
chain.providers.supportsClientTransport  // true if browser can reach it directly
chain.providers.status                   // 'online' | 'offline' | 'unknown' (probed at mount)
```

### Integration points

- Explorer header — replaces current `ChainSelector`
- `/tx` input page — replaces current `NetSelector`
- `/address` page — if multi-chain

### Cardano-specific details stay in the descriptor

The selector component is generic. Details like "Mainnet = addr prefix, Preprod = addr_test prefix, Devnet = requires port" come from `ChainDescriptor.address` and `ChainDescriptor.providers`.

## Acceptance Criteria

- [ ] Multi-chain selector component replaces `ChainSelector`
- [ ] Supports multiple chain families (at minimum Cardano's 4 networks)
- [ ] Flat list of all available chain+network combinations
- [ ] Current chain selection preserved across navigation
- [ ] URL updates to reflect new `[chainId]` param (#09)
- [ ] Devnet availability probe still works (green/red dot)
- [ ] Client-side port input for devnet still supported
- [ ] Loading state while resolving providers
- [ ] Existing explorer navigation still works

## Dependencies

- #01 (chain registry with all chain descriptors)
- #09 (explorer routing)

## Dependents

- None directly; UX polish
