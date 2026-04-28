# 13 — ADA Handle Integration

## Summary

Integrate ADA Handle resolution into the explorer: accept `$handle` inputs in the search bar, display handle names alongside addresses, and support handle-to-address and address-to-handle lookups.

## Motivation

ADA Handle is the Cardano equivalent of ENS — human-readable names (e.g., `$alice`, `$bob`) that resolve to Cardano addresses. Integrating handles makes the explorer more user-friendly:
1. Users can search `$alice` instead of `addr1qx...`
2. Address pages show associated handles
3. Transaction views show handle names instead of (or alongside) raw addresses

## How ADA Handle works

ADA Handles are **CIP-68 NFT tokens** held in a user's wallet. The handle `$alice` corresponds to a specific token under a known policy ID. Resolution is done by:
1. Looking up the token by asset name (the handle name) under the ADA Handle policy
2. Finding the UTxO that holds this token
3. The UTxO's address is the handle owner's address

There are multiple ways to resolve handles:

**Option A — Use the Koios API** (public, free):
```
GET https://api.koios.rest/api/v1/asset_address_list?_asset_policy=<handle_policy>&_asset_name=<hex_name>
```

**Option B — Query Blockfrost directly:**
```
assetsAssetAddressesGet(handlePolicyId + hexName) → list of addresses holding the handle
```

**Option C — Use the ADA Handle SDK** (if one exists as a package)

**Option D — Use the existing Blockfrost `CardanoAssetsApi`** (already in the monorepo):

```ts
const handlePolicyId = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a'; // mainnet
const handleHexName = hexEncode(handleName); // e.g., "alice" → hex
const unit = handlePolicyId + handleHexName;
const holders = await assetsApi.assetsAssetAddressesGet(unit);
const ownerAddress = holders[0]?.address;
```

**Most pragmatic: Option B/D** using the already-available Blockfrost SDK. No additional dependencies needed.

## Proposed Design

### Handle resolution utility

```ts
// app/_utils/handle-resolver.ts

const HANDLE_POLICY_ID_MAINNET = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';
const HANDLE_POLICY_ID_PREPROD = '...'; // preprod handle policy

function getHandlePolicyId(network: Network): string {
  return network === NETWORK.MAINNET ? HANDLE_POLICY_ID_MAINNET : HANDLE_POLICY_ID_PREPROD;
}

export async function resolveHandle(
  handle: string, // e.g., "$alice" or "alice"
  network: Network
): Promise<{ address: Address; handle: string } | null> {
  const handleName = handle.replace(/^\$/, ''); // strip $ prefix
  const hexName = Buffer.from(handleName).toString('hex');
  const unit = getHandlePolicyId(network) + hexName;

  try {
    const assetsApi = new CardanoAssetsApi(/* config */);
    const holders = await assetsApi.assetsAssetAddressesGet(unit, 1, 1);
    if (holders.length === 0) return null;
    return {
      address: holders[0].address as Address,
      handle: `$${handleName}`,
    };
  } catch {
    return null;
  }
}

export async function reverseResolveHandle(
  address: Address,
  network: Network
): Promise<string[]> {
  // Get all assets at this address, filter for handle policy tokens
  // Return handle names
}
```

### Search bar integration

When the search bar detects a `$` prefix, it calls `resolveHandle()` and redirects to the address page:

```ts
case 'handle':
  const resolved = await resolveHandle(input, network);
  if (resolved) {
    router.push(`/explorer/${chain.id}/addresses/${resolved.address}?handle=${resolved.handle}`);
  } else {
    toast.error(`Handle "${input}" not found`);
  }
```

### Display handle on address pages

On the address detail page (#03):
- If the URL has a `?handle=` query param, show `$handle` as the primary name
- Show all handles associated with this address (via reverse resolution)

### Display handles in transaction views

In `TxRow` and `TxOverview`:
- Next to each address, show the handle if available (e.g., `addr1qx... ($alice)`)
- This requires a handle lookup cache to avoid excessive API calls

### Handle resolution cache

To avoid hitting Blockfrost for every address in a transaction list:
- In-memory cache (Map<Address, string[]>) during a page render
- Optional: client-side cache via localStorage for frequently viewed addresses

### Network support

ADA Handles exist on mainnet and preprod. For preview/devnet, handles are not available — the resolver returns null immediately.

## Acceptance Criteria

- [ ] `$handle` search input resolves to address and navigates to address page
- [ ] Handle name displayed on address page when resolved via handle
- [ ] Handle shown alongside address in tx views (optional, performance-permitting)
- [ ] Handle resolution cache to avoid redundant API calls
- [ ] Graceful fallback when handle not found
- [ ] Network-aware handle policy IDs (mainnet vs preprod)
- [ ] No handle resolution attempted on preview/devnet

## Dependencies

- #03 (address page — where handle resolution lands)
- #09 (search bar — handle detection)
- `@laceanatomy/blockfrost-sdk` (`CardanoAssetsApi`) — already exists

## Dependents

- #09 (smart search calls this)
- #03 (address page displays handles)
