# 13 — Remove Cardano-Specific Copy from UI

## Summary

Replace all hardcoded "Cardano" references in UI strings, placeholders, and educational text with chain-aware strings from the chain descriptor.

## Motivation

Multiple UI strings are hardcoded to Cardano:

| File | Current text |
|------|-------------|
| `app/page.tsx:17` | "inspect and troubleshoot low-level Cardano transactions" |
| `app/page.tsx:39` | "Cardano infrastructure made simple" |
| `app/_components/Input/TxInput/TxInput.tsx:81` | "Enter CBOR or hash for any Cardano Tx" |
| `app/_components/Input/AddressInput.tsx:70` | "Enter any Cardano address in Bech32, Base58 or Hex encoding" |
| `app/_components/DissectSection/topics.tsx:2-5,33` | "Cardano transaction", "Cardano native tokens", "Cardano transactions are deterministic" |
| `app/explorer/layout.tsx` | "powered by Dolos" (Dolos is Cardano-specific) |
| `app/page.tsx:68-70` | GitHub URL: `txpipe-shop/cardano-graphical-tx/` |

## Proposed Changes

### Chain-aware strings in chain descriptor

Add a `ui` block to `ChainDescriptor`:

```ts
interface ChainUIDescriptor {
  /** Human-readable chain name, e.g. "Cardano", "Bitcoin" */
  chainName: string;
  /** "Powered by" branding text */
  poweredBy?: string;
  /** Placeholder for tx input */
  txInputPlaceholder: string;
  /** Placeholder for address input */
  addressInputPlaceholder: string;
  /** Educational topics for the dissect section */
  dissectTopics?: Array<{ title: string; content: string }>;
  /** Network info text */
  networkDescription: string;
  /** Explorer URL for external links */
  externalExplorerUrl?: string;
}

// Cardano example
cardanoMainnet: {
  ui: {
    chainName: 'Cardano',
    poweredBy: 'Powered by Dolos',
    txInputPlaceholder: 'Enter CBOR or hash for any Cardano Tx',
    addressInputPlaceholder: 'Enter any Cardano address in Bech32, Base58 or Hex encoding',
    dissectTopics: [
      { title: 'Transaction Overview', content: 'A Cardano transaction is...' },
      // ...
    ],
    networkDescription: 'Cardano Mainnet',
    externalExplorerUrl: 'https://cexplorer.io',
  },
};

// Bitcoin example (future)
bitcoinMainnet: {
  ui: {
    chainName: 'Bitcoin',
    poweredBy: undefined,  // no backend branding
    txInputPlaceholder: 'Enter hex or txid for any Bitcoin Tx',
    addressInputPlaceholder: 'Enter any Bitcoin address (Base58 or Bech32)',
    dissectTopics: undefined,  // Bitcoin doesn't have CBOR dissect
    networkDescription: 'Bitcoin Mainnet',
    externalExplorerUrl: 'https://mempool.space',
  },
};
```

### Updated pages

All pages that currently have hardcoded Cardano strings read from the chain descriptor instead:

```tsx
// page.tsx — home page is chain-agnostic
<p>inspect and troubleshoot low-level blockchain transactions</p>

// TxInput.tsx
placeholder={chain.ui.txInputPlaceholder}

// AddressInput.tsx
placeholder={chain.ui.addressInputPlaceholder}

// Explorer layout
<span>{chain.ui.poweredBy ? `${chain.ui.poweredBy}` : 'Blockchain Explorer'}</span>

// Home page
"Blockchain infrastructure made simple"
```

### What stays the same

- The GitHub URL and package name (`cardano-graphical-tx`) — those are project branding, not functional
- The `napi-pallas` import (Cardano CBOR library) — stays in legacy pages and API routes

## Acceptance Criteria

- [ ] `ChainUIDescriptor` type added to `ChainDescriptor`
- [ ] All `cardanoMainnet`, `cardanoPreprod`, etc. populate `ui` fields with current Cardano copy
- [ ] No hardcoded "Cardano" in any explorer page or shared component (except legacy paths)
- [ ] "Power by Dolos" shows only for chains that use Dolos backend
- [ ] Dissect topics come from chain descriptor
- [ ] Home page uses generic blockchain language
- [ ] All existing pages render identically for Cardano

## Dependencies

- #01 (`ChainDescriptor`)

## Dependents

- Low priority; cosmetic but important for credibility when non-Cardano chains are added
