# 07 — Governance Page (Proposals, DReps, Votes)

## Summary

Add a governance section at `/explorer/[chain]/governance` with sub-pages for proposals, proposal detail, DReps, and DRep detail, showing the state of Cardano on-chain governance.

## Motivation

Cardano's Conway era introduced on-chain governance: DReps, governance actions (proposals), votes, and treasury withdrawals. Users need to browse active proposals, see their status (ratified, enacted, dropped, expired), view DRep profiles and voting records, and understand the governance state of the chain.

## Proposed Design

### Routes

```
/explorer/[chain]/governance                     → Governance overview
/explorer/[chain]/governance/proposals           → Proposal list
/explorer/[chain]/governance/proposals/[txHash]/[certIndex]  → Proposal detail
/explorer/[chain]/governance/dreps               → DRep list
/explorer/[chain]/governance/dreps/[drepId]       → DRep detail
```

### Governance Overview Page

A dashboard summarizing governance state:

```
┌──────────────────────────────────────────────┐
│ Governance Overview  ·  Cardano Mainnet      │
├──────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌──────────────┐ │
│ │ Proposals │ │ DReps     │ │ Active Votes │ │
│ │   47      │ │   1,234   │ │    892       │ │
│ │  View →   │ │  View →   │ │   (recent)   │ │
│ └───────────┘ └───────────┘ └──────────────┘ │
├──────────────────────────────────────────────┤
│ Recent Proposals                             │
│┌────────────────────────────────────────────┐│
││ Hard Fork Initiation  │ Ratified  │ Ep 523 ││
││ New Constitution      │ Active    │ Ep 524 ││
││ Treasury Withdrawal   │ Dropped   │ Ep 521 ││
││ Info Action           │ Active    │ Ep 525 ││
││ Parameter Change      │ Active    │ Ep 524 ││
│└────────────────────────────────────────────┘│
│ [View all proposals →]                       │
└──────────────────────────────────────────────┘
```

### Proposals List Page

Paginated table from `governanceProposalsGet`:

| Column | Format |
|--------|--------|
| Type | Governance type badge (color-coded) |
| Tx Hash | Truncated + link to detail |
| Cert Index | Number |
| Status | Badge: Active / Ratified / Enacted / Dropped / Expired |
| Proposed Epoch | Number |
| Expires Epoch | Number |

**Governance type badges** (color coded):
- `hard_fork_initiation` — red
- `new_committee` — purple
- `new_constitution` — blue
- `info_action` — gray
- `no_confidence` — orange
- `parameter_change` — green
- `treasury_withdrawals` — yellow

### Proposal Detail Page

```
┌──────────────────────────────────────────────┐
│ ← Governance                                 │
│ Parameter Change — Tx a1b2c3... #0    [Copy] │
│ Status: Active  ·  Proposed: Ep 524          │
├──────────────────────────────────────────────┤
│ ┌─ Overview ────────────────────────────────┐│
│ │ Governance Type: parameter_change         ││
│ │ Deposit: 100,000 ADA                      ││
│ │ Return Address: stake1u...                ││
│ │ Expiration: Epoch 530                     ││
│ │ Ratified: —                               ││
│ │ Enacted: —                                ││
│ │ Dropped: —                                ││
│ └───────────────────────────────────────────┘│
│ ┌─ Proposed Parameter Changes ──────────────┐│
│ │ Max Tx Size: 16,384 → 32,768              ││
│ │ Key Deposit: 2 ADA → 1 ADA                ││
│ │ (shows only fields that would change)     ││
│ └───────────────────────────────────────────┘│
│ ┌─ Metadata ────────────────────────────────┐│
│ │ URL: https://gov.tools/proposal/abc       ││
│ │ Hash: 0xdef789...                         ││
│ │ Raw JSON: { ... }                         ││
│ └───────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Votes (156)] [Withdrawals (2)]              │ ← tabs
├──────────────────────────────────────────────┤
│ Voter Role │ Voter     │ Vote                │
│ DRep       │ drep1...  │ ✅ Yes              │
│ SPO        │ pool1...  │ ❌ No               │
│ CC         │ cc_hot... │ ⚪ Abstain          │
└──────────────────────────────────────────────┘
```

### DReps List Page

Paginated table from `governanceDrepsGet`:

| Column | Format |
|--------|--------|
| DRep ID | Truncated + link to detail |
| Hex | Truncated |
| Amount (stake) | ADA formatted |
| Status | Active / Retired / Expired |
| Has Script | Boolean badge |

### DRep Detail Page

```
┌──────────────────────────────────────────────┐
│ DRep: drep1abc...devx                  [Copy]│
│ Status: Active  ·  Stake: 12,345,678 ADA     │
├──────────────────────────────────────────────┤
│ ┌─ Info ────────────────────────────────────┐│
│ │ DRep ID: drep1...                         ││
│ │ Hex: 0xabc123...                          ││
│ │ Has Script: No                            ││
│ │ Last Active Epoch: 525                    ││
│ └───────────────────────────────────────────┘│
│ ┌─ Metadata ────────────────────────────────┐│
│ │ URL: https://mydrep.io                    ││
│ │ Hash: 0xdef789...                         ││
│ │ Name: My DRep (from JSON metadata)        ││
│ └───────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Votes] [Delegators] [Updates]               │ ← tabs
├──────────────────────────────────────────────┤
│ Tab content                                  │
└──────────────────────────────────────────────┘
```

### Tabs for DRep detail

1. **Votes** — paginated, tx hash (link), cert index, vote (yes/no/abstain badge)
2. **Delegators** — paginated, address (link to address page), amount (ADA)
3. **Updates** — paginated, tx hash (link), cert index, action (registered/deregistered/updated badge)

### Navigation

- Governance overview page links to proposals and DReps subpages
- Breadcrumbs on sub-pages: `Governance > Proposals > Proposal #...`
- "Back to Governance" link on detail pages

## Acceptance Criteria

- [ ] Governance overview dashboard at `/explorer/[chain]/governance`
- [ ] Proposals list page with pagination, type badges, status badges
- [ ] Proposal detail page with overview, parameter changes, metadata, votes, withdrawals
- [ ] DReps list page with pagination
- [ ] DRep detail page with votes, delegators, updates tabs
- [ ] Governance type and vote badges color-coded
- [ ] Links to tx detail page from proposal/DRep references
- [ ] Links to address page from delegator addresses
- [ ] Parameter change proposals show before/after values
- [ ] Metadata JSON rendered when available
- [ ] Empty states for no proposals/DReps
- [ ] Works for mainnet, preprod, preview

## Dependencies

- #01 (provider methods) OR direct Blockfrost `CardanoGovernanceApi` call
- #03 (address page — for delegator links)
- #06 (protocol params — parameter change context)
- #08 (status bar nav link)
- #09 (search bar — DRep/proposal search)

## Dependents

- None directly
