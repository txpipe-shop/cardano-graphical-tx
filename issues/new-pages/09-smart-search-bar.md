# 09 — Smart Multi-Type Search Bar

## Summary

Upgrade the explorer search from a single-purpose transaction hash search into a smart search that detects the input type (tx hash, block hash/height, address, script hash, token unit, pool ID, DRep ID, ADA Handle, epoch number) and routes to the correct page.

## Motivation

The current search (`TxSearch.tsx`) only accepts transaction hashes and blindly navigates to `/explorer/[chain]/txs/[hash]`. With 7+ new page types, users need a single search bar that figures out what they typed and sends them to the right place. This is standard on every blockchain explorer (cardanoscan, cexplorer, mempool.space).

## Proposed Design

### Input detection pipeline

```ts
function detectInputType(input: string): {
  type: 'tx' | 'block' | 'address' | 'script' | 'token' | 'pool' | 'drep' | 'epoch' | 'handle';
  normalized?: string;
} | null
```

Detection rules (evaluated in order):

| Priority | Pattern | Type | Route |
|----------|---------|------|-------|
| 1 | 64 hex chars | `tx` (or `block`) | `/txs/[hash]` or `/blocks/[hash]` — **ambiguous, ask or try tx first** |
| 2 | Starts with `$` | `handle` | Resolve handle → address → `/addresses/[addr]` |
| 3 | Starts with `addr1`, `addr_test1` | `address` | `/addresses/[address]` |
| 4 | Starts with `stake1`, `stake_test1` | `address` | `/addresses/[address]` (stake address) |
| 5 | Starts with `asset` + hex | `token` (fingerprint) | `/tokens/[fingerprint]` |
| 6 | 56+ hex chars (policy concat) | `token` (unit) | `/tokens/[unit]` |
| 7 | Starts with `pool1`, `pool_test1` | `pool` | `/pools/[id]` |
| 8 | Starts with `drep1`, `drep_test1` | `drep` | `/governance/dreps/[id]` |
| 9 | Starts with `script` + hex | `script` | `/scripts/[hash]` |
| 10 | Positive integer < 1,000,000 | `block` (height) | `/blocks/[height]` |
| 11 | Positive integer >= 1,000,000 | `epoch` or `slot` — **ambiguous** | Show disambiguation |
| 12 | Bech32 with unrecognized prefix | `unknown` | Show "Unrecognized address format" error |
| 13 | Otherwise | `tx` (default fallback) | `/txs/[input]` |

### Ambiguous inputs

**Case: 64 hex chars** — Could be a tx hash or block hash. Since tx hashes are the most common search, navigate to tx detail by default, but show a subtle "Search for block with this hash?" link on the tx detail page if it doesn't match.

**Case: large integer** — Could be an epoch number or slot number. Show a quick disambiguation dropdown:

```
[42,000,000                                ] [🔍]
  ┌─────────────────────────────┐
  │ Search as Epoch 420        │
  │ Search as Block Slot       │
  │ Search as Block Height     │
  └─────────────────────────────┘
```

### Search results page (optional refinement)

For ambiguous inputs where the type can't be confidently determined, navigate to a search results page that shows possible matches:

```
/explorer/[chain]/search?q=abc123...
```

This page would query multiple endpoints and show results grouped by type:
- "1 Transaction found"
- "0 Blocks found"
- "1 Address found"
- "3 Tokens found"

This is a nice-to-have; the initial implementation can just pick the most likely type and navigate there.

### Component

Replace `TxSearch.tsx` with `ExplorerSearch.tsx`:

```tsx
'use client';

function ExplorerSearch({ chain, className }: { chain: ChainDescriptor; className?: string }) {
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const detected = detectInputType(trimmed);
    if (!detected) {
      toast.error('Unrecognized input');
      return;
    }

    switch (detected.type) {
      case 'tx':
        router.push(`/explorer/${chain.id}/txs/${trimmed}`);
        break;
      case 'block':
        router.push(`/explorer/${chain.id}/blocks/${trimmed}`);
        break;
      case 'address':
        router.push(`/explorer/${chain.id}/addresses/${trimmed}`);
        break;
      case 'script':
        router.push(`/explorer/${chain.id}/scripts/${trimmed}`);
        break;
      case 'token':
        router.push(`/explorer/${chain.id}/tokens/${detected.normalized ?? trimmed}`);
        break;
      case 'pool':
        router.push(`/explorer/${chain.id}/pools/${trimmed}`);
        break;
      case 'drep':
        router.push(`/explorer/${chain.id}/governance/dreps/${trimmed}`);
        break;
      case 'epoch':
        router.push(`/explorer/${chain.id}/protocol?epoch=${trimmed}`);
        break;
      case 'handle':
        // Resolve handle first, then redirect
        resolveHandleToAddress(chain, trimmed).then(addr => {
          if (addr) router.push(`/explorer/${chain.id}/addresses/${addr}`);
          else toast.error('Handle not found');
        });
        break;
    }
  };

  return (
    <Input
      value={value}
      onValueChange={setValue}
      onKeyDown={e => e.key === 'Enter' && handleSearch()}
      placeholder="Search transactions, blocks, addresses, tokens..."
      endContent={<Button onPress={handleSearch}>Search</Button>}
      className={className}
    />
  );
}
```

### Placeholder

The search placeholder should be dynamic: "Search transactions, blocks, addresses, tokens, scripts, pools..."

### Integration points

- `ExplorerSearch` is rendered inside the `ExplorerNav` component (#08) — no longer a standalone element on each page
- On non-explorer pages, the search bar is not shown (or redirects to explorer)
- The search bar should be prominent (full width or nearly full width in the nav bar)

## Acceptance Criteria

- [ ] Input type detection correctly identifies all 10+ input types
- [ ] Search navigates to the correct page for each input type
- [ ] Ambiguous inputs (64-char hex, large integers) handled gracefully
- [ ] ADA Handle resolution triggered for `$handle` inputs
- [ ] Invalid/unrecognized inputs show a user-friendly error toast
- [ ] Placeholder text hints at supported search types
- [ ] Search works on all explorer pages
- [ ] Enter key and search button both trigger search
- [ ] Chain context preserved (search stays on the same network)

## Dependencies

- #02 (blocks page — for block search)
- #03 (address page — for address search)
- #04 (script page — for script search)
- #05 (token page — for token search)
- #06 (protocol page — for epoch search)
- #07 (governance page — for DRep search)
- #13 (ADA Handle — for handle resolution)
- #11 (pools page — for pool search, if implemented)

## Dependents

- #08 (navigation bar integrates this search)
