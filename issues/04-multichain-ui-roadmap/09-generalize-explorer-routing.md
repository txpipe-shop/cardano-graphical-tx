# 09 — Generalize Explorer Routing to `[chainId]`

## Summary

Change the explorer route parameter from `[chain]` (a Cardano network name) to `[chainId]` (a full chain identifier like `cardano-mainnet`), and resolve the chain descriptor at the layout level.

## Motivation

The explorer route structure currently looks like:

```
/explorer/[chain]/txs
/explorer/[chain]/txs/[hash]
```

Where `[chain]` is one of `mainnet | preprod | preview | devnet` — all implicitly Cardano. To support other chains, the param needs to encode both the chain family and the network.

## Proposed Changes

### Route param

```
/explorer/[chainId]/txs              → chainId = "cardano-mainnet"
/explorer/[chainId]/txs/[hash]       → chainId = "cardano-mainnet"
/explorer/[chainId]/blocks           → chainId = "bitcoin-mainnet" (future)
/explorer/[chainId]/addresses/[addr] → chainId = "cardano-preprod" (future)
```

### Layout resolution

The explorer layout (`app/explorer/layout.tsx`) reads `params.chainId`, looks it up in the chain registry, and provides the `ChainDescriptor` via React context:

```tsx
export default async function ExplorerLayout({
  params,
  children,
}: {
  params: { chainId: string };
  children: React.ReactNode;
}) {
  const chain = chainRegistry[params.chainId];
  if (!chain) notFound();

  const provider = resolveProvider(params.chainId, 'server');

  return (
    <ChainProviderContext.Provider value={{ chain, provider }}>
      <div className="relative">
        {children}
        <PoweredByBadge chain={chain} />
      </div>
    </ChainProviderContext.Provider>
  );
}
```

### Child pages

Child pages consume the chain descriptor from context instead of reading route params directly:

```tsx
// Before: /explorer/[chain]/txs/page.tsx
export default function TxsPage({ params: { chain } }: { params: { chain: string } }) {
  // chain is "mainnet" — implicitly Cardano
}

// After: /explorer/[chainId]/txs/page.tsx
export default function TxsPage({ params: { chainId } }: { params: { chainId: string } }) {
  const chain = chainRegistry[chainId];
  const provider = resolveProvider(chainId, 'server');
  // chain and provider are typed generically
}
```

### URL generation

Navigation links use the full chain ID:

```ts
// Before
href={`/explorer/${chain}/txs/${hash}`}

// After
href={chain.getExplorerUrl('tx', hash)}
// or
href={`/explorer/${chain.id}/txs/${hash}`}
```

### Backward compatibility

Cardano-only users currently use URLs like `/explorer/mainnet/txs/...`. Consider adding redirect rules or aliases so these don't break:

```ts
// next.config.mjs or middleware
{ source: '/explorer/:network(txs|blocks)/:path*',
  destination: '/explorer/cardano-:network/:path*' }
```

## Acceptance Criteria

- [ ] Explorer route uses `[chainId]` instead of `[chain]`
- [ ] Explorer layout resolves chain descriptor from `chainId`
- [ ] Chain descriptor provided via React context to child pages
- [ ] 404 page shown for unknown chain IDs
- [ ] All internal links use full chain IDs
- [ ] Backward-compatible redirects for old Cardano-only URLs
- [ ] Existing Cardano explorer pages work identically
- [ ] "Powered by Dolos" badge now shows chain-appropriate branding

## Dependencies

- #01 (chain registry)
- #04 (provider factory)

## Dependents

- Every explorer page and component
