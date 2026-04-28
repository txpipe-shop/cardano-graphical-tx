# 11 — Stake Pools List & Detail Page (Maybe)

## Summary

Add stake pool pages at `/explorer/[chain]/pools` (list) and `/explorer/[chain]/pools/[poolId]` (detail) showing pool metadata, delegators, history, and performance data.

## Motivation

Stake pools are a core Cardano infrastructure concept. Users want to browse pools, see their metadata, delegation size, margin, pledge, and performance history.

**Note:** Marked as "maybe." DolosProvider and U5CProvider don't implement `getPools`/`getPool`. DbSyncProvider does. For Dolos, we can call Blockfrost `CardanoPoolsApi` directly.

## Proposed Design

### Routes

```
/explorer/[chain]/pools                      → Pool list (with search)
/explorer/[chain]/pools/[poolId]             → Pool detail
```

### Pool list page

Paginated table from Blockfrost `poolsExtendedGet()`:

| Column | Format |
|--------|--------|
| Name / Ticker | Pool name + ticker (with logo) |
| Pool ID | Truncated bech32 (pool1...) |
| Stake | ADA formatted |
| Delegators | Count |
| Margin | Percentage |
| Pledge | ADA formatted |
| Fixed Cost | ADA formatted |

Search bar at the top to filter by pool name or ID (delegates to Blockfrost's search param).

### Pool detail page

```
┌──────────────────────────────────────────────┐
│ [Logo] POOLNAME [TICKER]                      │
│ Pool ID: pool1abc...devx                [Copy]│
├──────────────────────────────────────────────┤
│ ┌── Overview ────────────────────────────────┐│
│ │ Stake:       12,345,678 ADA               ││
│ │ Delegators:  1,234                        ││
│ │ Pledge:      500,000 ADA                  ││
│ │ Margin:      2.5%                         ││
│ │ Fixed Cost:  340 ADA                      ││
│ │ Hex:         0xabc123...                  ││
│ │ Homepage:    https://pool.example.com     ││
│ └────────────────────────────────────────────┘│
│ ┌── Description ─────────────────────────────┐│
│ │ A reliable stake pool operated by...      ││
│ └────────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Delegators (1,234)] [History] [Updates]      │ ← tabs
├──────────────────────────────────────────────┤
│ Address            │ Amount                  │
│ addr1qxyz...       │ 1,000 ADA               │
│ stake1abc...       │ 500 ADA                 │
└──────────────────────────────────────────────┘
```

### Tabs

1. **Delegators** — paginated, address (link to #03), amount (ADA)
2. **History** — paginated, epoch, blocks produced, active stake, rewards
3. **Updates** — pool certificate updates (registration, parameter changes)

### Component reuse

- `<Pagination>` — all tabs
- `<CopyButton>` — pool ID
- Address links from delegator entries to the address page (#03)

## Acceptance Criteria

- [ ] `/explorer/[chain]/pools` renders paginated pool list with search
- [ ] `/explorer/[chain]/pools/[poolId]` renders pool detail
- [ ] Pool metadata displayed (name, ticker, logo, description, homepage)
- [ ] Pool stats displayed (stake, delegators, pledge, margin, fixed cost)
- [ ] Delegators tab with pagination and address links
- [ ] History tab with epoch-based performance
- [ ] Updates tab with pool certificate history
- [ ] Works for mainnet, preprod, preview

## Dependencies

- #01 (provider method for pools) OR direct Blockfrost `CardanoPoolsApi` call
- #03 (address page — for delegator address links)

## Dependents

- #08 (status bar — Pools nav link, if implemented)
- #09 (search bar — pool ID detection)
