# 04 — Script Detail Page

## Summary

Add a script detail page at `/explorer/[chain]/scripts/[scriptHash]` showing script information (type, size, CBOR/JSON view) and its redeemer history.

## Motivation

Cardano scripts (timelock, Plutus V1/V2/V3) are a fundamental primitive. Users need to inspect a script's details, see its type, size, raw CBOR (for Plutus) or JSON timelock structure, and browse transactions that executed it (via redeemers).

## Proposed Design

### Route

```
/explorer/[chain]/scripts/[scriptHash]
```


Called directly from the server component (or via `ChainProvider` if `#01-a` is done first).

### Page layout

```
┌──────────────────────────────────────────────┐
│ Script: 0xabc123...                    [Copy]│
│ Type: Plutus V2  ·  Size: 15,432 bytes       │
├──────────────────────────────────────────────┤
│ ┌─── Script CBOR ───────────────────────────┐│
│ │ (CodeMirror or styled <pre>)              ││
│ │ 5901a100d8799f...                         ││
│ └───────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Redeemers (156)                            ]│ ← tab
├──────────────────────────────────────────────┤
│ Tx Hash    │ Purpose │ Mem   │ Steps  │ Fee  │
│ a1b2c3d4...│ Spend   │ 12345 │ 6.7M   │ 0.4A │
│ e5f6a7b8...│ Mint    │ 2000  │ 1.2M   │ 0.1A │
│ ...                                          │
└──────────────────────────────────────────────┘
```

### Script type display

Based on `Script.type`:
- `timelock` → Show the JSON structure in a formatted reader
- `plutusV1`, `plutusV2`, `plutusV3` → Show the CBOR in a CodeMirror viewer (reuse the CBOR tab component or minimal `<pre>`)

### Redeemers table

Paginated table (from `scriptsScriptHashRedeemersGet`):

| Column | Source | Format |
|--------|--------|--------|
| Transaction | `tx_hash` | Truncated hash, links to tx detail |
| Tx Index | `tx_index` | Number |
| Purpose | `purpose` | Badge: `spend`(blue), `mint`(green), `cert`(purple), `reward`(orange) |
| Memory | `unit_mem` | Formatted number |
| Steps | `unit_steps` | Formatted number |
| Fee | `fee` | ADA formatted |
| Redeemer Data | `redeemer_data_hash` | Truncated, monospace |

### Error states

- Script not found → "Script not found on {network}" error card
- CBOR not available (null) → "CBOR not available for this script type"
- Provider failure → standard error card

### Component reuse

- `<CopyButton>` — script hash copy
- `<Pagination>` — redeemer list pagination
- `<CodeMirrorViewer>` — (create minimal one or reuse pattern from TxCbor)
- `<TxTable>` — not directly, but the redeemer table follows the same styling

## Acceptance Criteria

- [ ] `/explorer/[chain]/scripts/[scriptHash]` renders script detail
- [ ] Script type badge shown (timelock / Plutus V1 / V2 / V3)
- [ ] CBOR shown for Plutus scripts in readable format
- [ ] JSON shown for timelock scripts
- [ ] Redeemer table with pagination
- [ ] Redeemer tx hash links to tx detail page
- [ ] Copy button for script hash
- [ ] Error state for invalid/missing scripts
- [ ] Works for all 4 Cardano networks

## Dependencies

- `#01-a` (provider methods for scripts) OR direct Blockfrost SDK call in server component
- #09 (search bar — script hash detection)

## Dependents

- #08 (status bar nav link)
