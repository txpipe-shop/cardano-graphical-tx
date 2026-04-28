# 06 — Protocol Parameters Page

## Summary

Add a protocol parameters page at `/explorer/[chain]/protocol` showing the current era's protocol parameters (fees, sizes, collateral, governance thresholds, Plutus cost models) and historical epoch parameters.

## Motivation

Protocol parameters define the economic and technical rules of the Cardano ledger. Users, developers, and DApp operators need to see current parameters (min fees, max tx size, collateral requirements, governance voting thresholds) and how they change across epochs.

## Proposed Design

### Route

```
/explorer/[chain]/protocol
```

Also support per-epoch query:
```
/explorer/[chain]/protocol?epoch=420
```

### Data source

Blockfrost `CardanoEpochsApi`:

```
epochsLatestParametersGet()          → EpochParamContent (current params)
epochsNumberParametersGet(number)    → EpochParamContent (historical params)
```

Called directly from the server component.

### Page layout

```
┌──────────────────────────────────────────────┐
│ Protocol Parameters  ·  Epoch 525            │
│ [Epoch selector: ← 420 421 422 ... 525 →   ]│
├──────────────────────────────────────────────┤
│ ┌─ Transaction Parameters ───────────────────┐│
│ │ Min Fee (A):    44 lovelace               ││
│ │ Min Fee (B):    155,381 lovelace/byte     ││
│ │ Max Tx Size:    16,384 bytes              ││
│ │ Max Val Size:   5,000 bytes               ││
│ │ Min UTxO:       0.96 ADA (deprecated)     ││
│ └────────────────────────────────────────────┘│
│ ┌─ Script / Ex Units ────────────────────────┐│
│ │ Price Mem:      0.0577 lovelace/unit      ││
│ │ Price Step:     0.0000721 lovelace/unit   ││
│ │ Max Tx Ex Mem:  14,000,000               ││
│ │ Max Tx Ex Steps: 10,000,000,000          ││
│ │ Max Block Ex Mem: 62,000,000             ││
│ │ Max Block Ex Steps: 20,000,000,000       ││
│ └────────────────────────────────────────────┘│
│ ┌─ Stake / Pool Parameters ──────────────────┐│
│ │ Key Deposit:    2 ADA                     ││
│ │ Pool Deposit:   500 ADA                   ││
│ │ Min Pool Cost:  340 ADA                   ││
│ │ Rho (ρ):        0.003                    ││
│ │ Tau (τ):        0.2                      ││
│ │ a0 (pledge):    0.3                      ││
│ │ nOpt:           500                      ││
│ │ eMax:           18                       ││
│ └────────────────────────────────────────────┘│
│ ┌─ Collateral ───────────────────────────────┐│
│ │ Collateral %:         150                 ││
│ │ Max Collateral Inputs: 3                   ││
│ │ Ref Script Cost/Byte:  15 lovelace        ││
│ │ Coins per UTxO Byte:   4,310 lovelace    ││
│ └────────────────────────────────────────────┘│
│ ┌─ Governance Thresholds ─────────────────────┐│
│ │ No Confidence (PVT):    51%               ││
│ │ Committee Normal (PVT): 51%               ││
│ │ Committee NoConf (PVT): 60%               ││
│ │ Hard Fork Init (PVT):   51%               ││
│ │ ── DVT ──                                 ││
│ │ No Confidence: 67%                        ││
│ │ Committee Normal: 67%                     ││
│ │ Committee NoConf: 67%                     ││
│ │ Update Constitution: 75%                  ││
│ │ Hard Fork Init: 60%                       ││
│ │ PP Network: 67%                           ││
│ │ PP Economic: 67%                          ││
│ │ PP Technical: 67%                         ││
│ │ PP Governance: 75%                        ││
│ │ Treasury Withdrawal: 67%                  ││
│ ├────────────────────────────────────────────┤│
│ │ Gov Action Lifetime:   6 epochs           ││
│ │ Gov Action Deposit:    100,000 ADA        ││
│ │ DRep Deposit:          500 ADA            ││
│ │ DRep Activity:         20 epochs          ││
│ │ Committee Min Size:    7                  ││
│ │ Committee Max Term:    60 epochs          ││
│ │ PP Security (PVT):     51%               ││
│ └────────────────────────────────────────────┘│
│ ┌─ Plutus Cost Models ───────────────────────┐│
│ │ (Collapsible JSON tree viewer)            ││
│ │ Plutus V1: { "addInteger-cpu": 205665, ...││
│ │ Plutus V2: { ... }                        ││
│ │ Plutus V3: { ... }                        ││
│ └────────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

### Epoch selector

A row of buttons or a `<Select>` dropdown to switch between epochs. Shows the current epoch highlighted. Previous/next arrows for navigation.

### Sections

Group parameters into collapsible sections for readability:
1. **Transaction Parameters** — min fees, max sizes
2. **Script / Ex Units** — Plutus pricing
3. **Stake / Pool Parameters** — staking economics
4. **Collateral Parameters** — collateral requirements
5. **Governance Thresholds** — PVT/DVT, deposits, lifetimes
6. **Plutus Cost Models** — raw JSON (collapsible)

### Value formatting

- Lovelace amounts → ADA with proper formatting
- Percentages → "51%", "67%"
- Large numbers → "14,000,000"
- Epoch counts → "6 epochs"

### Empty/error states

- Parameters not available for this epoch → "No parameter data for epoch {N}"
- Provider failure → standard error card

## Acceptance Criteria

- [ ] `/explorer/[chain]/protocol` renders current epoch's protocol parameters
- [ ] Epoch selector works to view historical parameters
- [ ] All parameter sections displayed with human-readable formatting
- [ ] Plutus cost models shown in collapsible JSON viewer
- [ ] Values formatted appropriately (ADA, %, commas)
- [ ] Governance thresholds section included (Conway era)
- [ ] Works for mainnet, preprod, preview (devnet may not have params)
- [ ] Loading skeleton during fetch
- [ ] Error state when params unavailable

## Dependencies

- #01 (provider method) OR direct Blockfrost `CardanoEpochsApi` call
- #08 (status bar — protocol nav link)
- #09 (search bar — "protocol" keyword search)

## Dependents

- #07 (governance page — params referenced in governance context)
