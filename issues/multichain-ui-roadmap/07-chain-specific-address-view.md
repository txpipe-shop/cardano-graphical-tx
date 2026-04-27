# 07 — Create Chain-Specific Address View Components

## Summary

Extract the Cardano-specific address parsing UI into a chain-specific `AddressView` slot, and create a generic fallback. Wire it into the explorer and the `/address` page.

## Motivation

The current address UI is deeply Cardano-specific:

- `AddressSection/ValidAddr.tsx` — validates bech32/base58 Cardano addresses
- `AddressSection/ByronSection.tsx` — Byron-era address diagnostics (CBOR-based)
- `AddressSection/ShelleySection.tsx` — Shelley-era address diagnostics (stake key, payment key)
- `AddressSection/StakeSection.tsx` — Stake address diagnostics
- `app/api/address/route.ts` — uses napi-pallas `parseAddress()` which is Cardano-only
- `ColoredAddress.tsx` — rainbow-colored address display (hex-to-color)
- `_utils/network-config.ts` — `addressPrefix` (`addr` / `addr_test`)

Other chains have completely different address formats:
- **Bitcoin**: Base58Check (P2PKH, P2SH, P2WPKH), Bech32 (segwit), Bech32m (taproot)
- **Midnight**: SS58 or its own format
- **Hydra**: Same as Cardano

## Proposed Design

### `AddressView` slot component

```ts
// In ChainUIComponents
AddressView?: ComponentType<{
  address: string;
  chain: ChainDescriptor;
  /** Optional parsed address data from the API */
  parsed?: unknown;
}>;
```

### Generic fallback

```tsx
function DefaultAddressView({ address, chain }: { address: string; chain: ChainDescriptor }) {
  return (
    <div>
      <ColoredAddress address={address} />
      <CopyButton text={address} />
      <ValidAddr address={address} isValid={chain.address.isValidAddress(address)} />
    </div>
  );
}
```

### Cardano-specific `AddressView`

The existing `AddressSection` suite (`ShelleySection`, `ByronSection`, `StakeSection`) gets wrapped as a single `CardanoAddressView` component that:
1. Calls the existing `/api/address` endpoint
2. Renders the appropriate section based on parsed address type
3. Shows the rainbow-colored address

### `/address` legacy page

The `/address` page becomes a thin wrapper:

```tsx
export default function AddressPage({ searchParams }: { searchParams: { address?: string; network?: string } }) {
  const chain = resolveChainById(searchParams.network ?? 'cardano-mainnet');
  const AddressView = chain.components.AddressView ?? DefaultAddressView;
  return (
    <div>
      <AddressInput placeholder={chain.address.placeholder} />
      {searchParams.address && <AddressView address={searchParams.address} chain={chain} />}
    </div>
  );
}
```

### Address in explorer

When viewing an address in the explorer (via tx inputs/outputs), use the chain's `AddressView` to show address details inline or in a panel.

## Acceptance Criteria

- [ ] `CardanoAddressView` extracted from existing `AddressSection` components
- [ ] `DefaultAddressView` generic fallback implemented (just shows raw address + copy button)
- [ ] `AddressView` slot registered in Cardano chain descriptors
- [ ] `/address` page uses chain-aware `AddressView`
- [ ] Address display in explorer tx detail uses chain-aware `AddressView`
- [ ] Address validation uses `chain.address.isValidAddress()` from descriptor
- [ ] Address prefix comes from `chain.address.defaultPrefix` / `chain.address.testPrefix`
- [ ] No regressions in existing Cardano address UX

## Dependencies

- #01 (`ChainDescriptor` with address config)
- #02 (component slots interface)

## Dependents

- None directly, but enables #10 (chain selector) for non-Cardano addresses
