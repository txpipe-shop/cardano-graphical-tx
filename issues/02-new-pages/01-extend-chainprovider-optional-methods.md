# 01 — Extend `ChainProvider` with New Optional Methods (Tracking Issue)

> **This issue has been split into smaller chunks.** Do not implement directly; use the sub-issues below.

## Summary

Add optional methods to the `ChainProvider` interface in `@laceanatomy/provider-core` to support the new explorer pages (scripts, tokens, governance, protocol parameters). Implement them in `DolosProvider` using the already-generated Blockfrost SDK classes.

## Split Issues

| Sub-Issue | Scope | When to Implement |
|-----------|-------|-------------------|
| `#01-a` | Token & Script methods (`getToken`, `getTokens`, `getTokenHolders`, `getScript`, `getScripts`) | Before #04 (script) and #05 (token) pages |
| `#01-b` | Governance methods (`getDRep`, `getDReps`, `getProposal`, `getProposals`, `getProposalVotes`, `getDRepVotes`) | Before #07 (governance) page |
| `#01-c` | Protocol Parameters method (`getProtocolParams`) | Before #06 (protocol params) page |

## Motivation

The current `ChainProvider` interface covers blocks, transactions, addresses, epochs, and (optionally) pools. New explorer pages need additional methods for assets, scripts, governance, and protocol parameters. These APIs are **fully generated** in `@laceanatomy/blockfrost-sdk` but never wired into any provider.

## Acceptance Criteria (Tracking)

- [ ] `#01-a` completed and merged
- [ ] `#01-b` completed and merged (or deferred)
- [ ] `#01-c` completed and merged (or deferred)

## Dependencies

- `@laceanatomy/blockfrost-sdk` (already exists, fully generated)
- `@laceanatomy/provider-core` (modified in sub-issues)

## Dependents

- #04 (script page) → needs `#01-a`
- #05 (token page) → needs `#01-a`
- #06 (protocol params page) → needs `#01-c`
- #07 (governance page) → needs `#01-b`
