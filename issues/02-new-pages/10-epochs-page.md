# 10 — Epochs List & Detail Page (Maybe)

## Summary

Add an epochs list page (`/explorer/[chain]/epochs`) and epoch detail page (`/explorer/[chain]/epochs/[number]`) showing epoch metadata, protocol parameters at that epoch, and block distribution.

## Motivation

Epochs are a fundamental Cardano concept (5-day periods). Users want to browse epoch history, see stats per epoch (blocks produced, transactions, fees, duration), and view protocol parameters that were active during a specific epoch.

**Note:** Marked as "maybe" because the DolosProvider and U5CProvider currently stub `getEpoch`/`getEpochs` with errors. DbSyncProvider implements them. For Dolos, we can call Blockfrost `CardanoEpochsApi` directly.

## Proposed Design

### Routes

```
/explorer/[chain]/epochs                    → Epoch list
/explorer/[chain]/epochs/[number]           → Epoch detail
```

### Epoch list page

Paginated table from Blockfrost `epochsLatestGet()` + `epochsNumberPreviousGet()`:

| Column | Format |
|--------|--------|
| Epoch | Number |
| Start Time | Formatted timestamp |
| End Time | Formatted timestamp |
| Blocks | Count |
| Transactions | Count |
| Fees (ADA) | ADA formatted |
| Link | → Detail |

### Epoch detail page

```
┌──────────────────────────────────────────────┐
│ Epoch 525                                     │
│ Jan 15, 2025 12:00:00 → Jan 20, 2025 21:44:51│
├──────────────────────────────────────────────┤
│ ┌── Stats ────────────────────────────────────┐│
│ │ Start Slot: 123,456,789                    ││
│ │ End Slot:   124,567,890                    ││
│ │ Start Height: 10,500,000                   ││
│ │ End Height:   10,600,000                   ││
│ │ Blocks:     21,600                         ││
│ │ Transactions: 1,234,567                    ││
│ │ Total Fees: 45,678 ADA                     ││
│ └─────────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ ┌── Protocol Parameters ─────────────────────┐│
│ │ (link to /protocol?epoch=525)              ││
│ └─────────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Blocks (21,600)]                             │ ← tab
├──────────────────────────────────────────────┤
│ Block table (reused blocks list component)    │
└──────────────────────────────────────────────┘
```

### Epoch navigation

Previous / Next epoch buttons at the top of the detail page:
```
← Epoch 524    |    Epoch 525 (current)    |    Epoch 526 →
```

### Component reuse

- `<Pagination>` — for epoch list and blocks in epoch
- Blocks table from #02 — for blocks in epoch tab
- Parameter display from #06 — for proto params link

## Acceptance Criteria

- [ ] `/explorer/[chain]/epochs` renders paginated epoch list
- [ ] `/explorer/[chain]/epochs/[number]` renders epoch detail
- [ ] Epoch stats displayed (slot range, height range, blocks, txs, fees)
- [ ] Protocol parameters link to protocol page with epoch filter
- [ ] Blocks tab shows blocks from that epoch
- [ ] Previous/Next epoch navigation
- [ ] Works for mainnet, preprod, preview via Blockfrost (or DbSync if available)
- [ ] Devnet shows "Epoch data not available for devnet" message

## Dependencies

- #01 (provider method for epochs) OR direct Blockfrost `CardanoEpochsApi` call
- #02 (blocks list — reused for blocks tab)
- #06 (protocol params — linked from epoch detail)

## Dependents

- #08 (status bar — Epochs nav link, if implemented)
- #09 (search bar — epoch number detection)
