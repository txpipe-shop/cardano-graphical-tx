# 12 — DReps (Delegated Representatives) Page (Maybe)

## Summary

Add a DReps page as a sub-section of governance showing DRep registration status, stake delegated to them, and their voting activity.

## Motivation

DReps are a key Cardano Conway governance primitive. Users need to see who the active DReps are, how much stake they represent, and their voting records. This is related to governance (#07) but can be a standalone view for users who specifically want to browse DReps.

**Note:** Marked as "maybe." This could be part of the governance page (#07) rather than a standalone section. The distinction is:
- Governance page (#07): browse proposals + DReps together
- This issue: dedicated DRep-focused view with richer detail (delegator distribution, vote history, registration timeline)

If the governance page (#07) already covers DReps sufficiently, this issue can be folded into that one.

## Proposed Design

### Route

```
/explorer/[chain]/dreps                      → DRep list
/explorer/[chain]/dreps/[drepId]             → DRep detail
```

If DRep page is a section within governance:
```
/explorer/[chain]/governance/dreps           → (already covered by #07)
/explorer/[chain]/governance/dreps/[drepId]   → (already covered by #07)
```

### DRep list page (if standalone)

Paginated table from Blockfrost `governanceDrepsGet()`:

| Column | Format |
|--------|--------|
| DRep ID | Truncated bech32 (drep1...) |
| Stake | ADA formatted (total delegator stake) |
| Status | Active / Retired / Expired badge |
| Has Script | Yes/No badge |
| Last Active Epoch | Number |

### DRep detail page (if different from governance version)

```
┌──────────────────────────────────────────────┐
│ DRep: drep1abc...devx                   [Copy]│
│ Status: Active  ·  Stake: 12,345,678 ADA     │
├──────────────────────────────────────────────┤
│ ┌── Info ────────────────────────────────────┐│
│ │ DRep ID: drep1...                         ││
│ │ Hex: 0xabc123...                          ││
│ │ Has Script: No                            ││
│ │ Active Since Epoch: 500                   ││
│ │ Last Active: Epoch 525                    ││
│ │ Metadata URL: https://mydrep.io          ││
│ │ Metadata Hash: 0xdef789...               ││
│ └────────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ ┌── Delegator Distribution ─────────────────┐│
│ │ [Bar chart or top delegates list]         ││
│ │ Top 10 Delegators:                        ││
│ │ addr1xyz...    5,000,000 ADA             ││
│ │ addr1abc...    3,200,000 ADA             ││
│ │ ...                                       ││
│ └────────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│ [Recent Votes (50)] [All Delegators (1,234)]  │ ← tabs
├──────────────────────────────────────────────┤
│ Proposal          │ Vote                    │
│ Parameter Change  │ ✅ Yes                  │
│ New Constitution  │ ✅ Yes                  │
│ Treasury W/draw   │ ❌ No                   │
│ Hard Fork Init    │ ⚪ Abstain              │
└──────────────────────────────────────────────┘
```

### Relationship to governance page (#07)

If this page is a **standalone**, it offers a DRep-centric view distinct from the proposal-centric view in #07. If it's **folded into #07**, the DRep list becomes a tab/route under `/governance/dreps` and the detail page includes the same information.

**Recommendation**: For MVP, fold DReps into the governance page (#07). Create this standalone version only if DRep pages need significantly different UX (e.g., DRep leaderboard, delegator distribution chart).

## Acceptance Criteria (if standalone)

- [ ] `/explorer/[chain]/dreps` renders paginated DRep list
- [ ] `/explorer/[chain]/dreps/[drepId]` renders DRep detail
- [ ] DRep delegator distribution shown (top N delegators)
- [ ] Vote history tab with proposal links
- [ ] Delegators tab with address links
- [ ] Updates/registration history shown
- [ ] Works for mainnet, preprod, preview

## Dependencies

- #07 (governance page — types, data fetching, navigation context)
- #03 (address page — for delegator links)

## Dependents

- #08 (status bar — Dreps nav link if standalone)
- #09 (search bar — DRep ID detection)
