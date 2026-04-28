# Transaction Metadata Display (CIP-20, CIP-25, CIP-27, CIP-68)

> **good first issue** — This issue is beginner-friendly and reuses existing tab infrastructure.

## Goal
Add a **Metadata** tab to the single transaction detail page (`/explorer/[chain]/txs/[hash]`) showing transaction-level metadata for known standards.

## Background
Transactions can carry metadata in their auxiliary data. Several CIPs define standard metadata formats:
- **CIP-20**: Transaction messages (`674` label)
- **CIP-25**: NFT metadata (`721` label)
- **CIP-27**: Royalty metadata (`777` label)
- **CIP-68**: Reference token minting (detected via mint field + reference token output)

Currently the transaction detail page has tabs: Overview, Diagram, Dissect, CBOR, Datum, Scripts. There is no dedicated metadata view.

## Proposed Design

### New Tab: Metadata

Add a "Metadata" tab to `TxTabs`. This tab is:
- **Shown** when the transaction has metadata (CIP-20, CIP-25, CIP-27, or CIP-68 detected)
- **Hidden** when the transaction has no metadata

### Tab Content Structure

```
┌──────────────────────────────────────────────┐
│ Metadata (detected standards)                │
├──────────────────────────────────────────────┤
│ [CIP-20 Message] [CIP-25 NFT] [CIP-27 Royalty]│ ← sub-tabs or accordion
├──────────────────────────────────────────────┤
│ Parsed metadata content                      │
│ ── Raw JSON / CBOR toggle ──                 │
└──────────────────────────────────────────────┘
```

### Standard-Specific Displays

#### CIP-20 — Transaction Message
- Label: `674`
- Display the `msg` array as a formatted message
- Example: `msg: ["Invoice #12345", "Thank you for your purchase"]`

#### CIP-25 — NFT Metadata
- Label: `721`
- Display token metadata grouped by policy ID
- Fields: name, image, mediaType, description, files, attributes
- Show thumbnail if image URL is present

#### CIP-27 — Royalty Metadata
- Label: `777`
- Display: `rate` (percentage), `addr` (royalty recipient address)
- Format rate as percentage (e.g., `0.05` → `5%`)

#### CIP-68 — Reference Token Detection
- Not a metadata label, but detected from transaction structure:
  - Transaction mints a user token AND a reference token (with `000643b0` or `000de140` prefix)
  - Reference token is sent to a script address with a datum
- Display: reference token info, datum preview, link to the reference token UTxO

### Raw View Toggle

Each standard section has a toggle to show:
- **Parsed view**: Human-readable formatted data
- **Raw JSON**: The metadata as JSON
- **Raw CBOR**: Hex-encoded CBOR (if available)

### Data Source

Transaction metadata is already available on `cardano.Tx`:
```ts
tx.metadata?: Metadata; // Map<bigint, Metadatum>
```

Parse the metadata map keys:
- `674n` → CIP-20
- `721n` → CIP-25
- `777n` → CIP-27

CIP-68 detection requires checking `tx.mint` for reference token prefixes.

## Component Reuse

- `<DetailTabs>` or `<Accordion>` from Heroui for standard switching
- `<TokenPill>` for displaying assets in CIP-25 metadata
- `<ColoredAddress>` for addresses in CIP-27 royalty
- `<CopyButton>` for raw CBOR hex

## Acceptance Criteria
- [ ] "Metadata" tab added to `TxTabs`
- [ ] Tab is hidden when transaction has no metadata
- [ ] CIP-20 messages displayed as formatted text
- [ ] CIP-25 NFT metadata displayed with thumbnails and attributes
- [ ] CIP-27 royalty rate displayed as percentage with recipient address
- [ ] CIP-68 reference token minting detected and displayed
- [ ] Raw JSON / CBOR toggle available for each standard
- [ ] Consistent styling with existing explorer tabs
- [ ] `pnpm check` and `pnpm lint` pass

## Dependencies
- `02-blocks-list-and-detail` — for `DetailTabs` component (if generalized by then)
- `05-token-asset-page` — for CIP-68 reference token understanding

## Related
- `issues/02-new-pages/05-token-asset-page.md` (CIP-68)
- [CIP-20](https://cips.cardano.org/cip/CIP-20)
- [CIP-25](https://cips.cardano.org/cip/CIP-25)
- [CIP-27](https://cips.cardano.org/cip/CIP-27)
- [CIP-68](https://cips.cardano.org/cip/CIP-68)
