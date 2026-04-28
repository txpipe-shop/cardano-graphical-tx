# 14 — Stake Registrations / Certificates Page (Maybe)

## Summary

Add a page showing recent stake registration/deregistration certificates, delegation changes, and reward withdrawals.

## Motivation

Users may want to browse recent stake-related events: who registered a stake key, who delegated to which pool, and recent reward withdrawals. This is less commonly requested than the other pages.

**Note:** Marked as "maybe." Low priority compared to the definite pages.

## Proposed Design

### Route

```
/explorer/[chain]/registrations          → Recent stake registrations
```

Or as a tab on the address page or pools page.

### Data source

Blockfrost `CardanoAccountsApi`:
- `accountsGet()` — list of stake accounts (too broad)
- Blockfrost `CardanoTransactionsApi`:
  - `txsHashDelegationsGet(hash)` — delegation certs in a tx
  - Address-level queries from `CardanoAddressesApi`

Or query via Blockfrost search for recent transactions containing stake certs.

### Content

A paginated list of recent stake events:

| Column | Format |
|--------|--------|
| Certificate Type | Badge: Registration / Deregistration / Delegation / Withdrawal |
| Stake Address | Truncated, link to address page |
| Transaction | Truncated hash, link to tx detail |
| Epoch | Number |
| Pool ID (for delegation) | Truncated, link to pool page |

### Alternative: embed in address page

Instead of a standalone page, stake registration info could be shown as a tab on the address detail page (#03) for stake addresses specifically. This is the more natural UX.

## Acceptance Criteria (if standalone)

- [ ] `/explorer/[chain]/registrations` renders recent stake cert events
- [ ] Certificate type badges
- [ ] Links to address, tx, and pool pages
- [ ] Pagination

## Dependencies

- #03 (address page)
- #11 (pools page, for delegation targets)

## Dependents

- None significant
