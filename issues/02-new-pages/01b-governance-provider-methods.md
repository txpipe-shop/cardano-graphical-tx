# 01-b — Extend `ChainProvider` with Governance Methods

## Summary

Add optional governance methods to `ChainProvider` in `@laceanatomy/provider-core`, and implement them in `DolosProvider` via Blockfrost SDK.

## Motivation

The governance page (#07) needs provider methods for DReps, proposals, and votes.

## Methods

```ts
export interface ChainProvider<...> {
  getDRep?(params: GovernanceDRepReq): Promise<GovernanceDRepRes>;
  getDReps?(params: GovernanceDRepsReq): Promise<PaginatedResult<GovernanceDRepRes>>;
  getProposal?(params: GovernanceProposalReq): Promise<GovernanceProposalRes>;
  getProposals?(params: GovernanceProposalsReq): Promise<PaginatedResult<GovernanceProposalRes>>;
  getProposalVotes?(params: GovernanceProposalReq): Promise<PaginatedResult<GovernanceVoteRes>>;
  getDRepVotes?(params: GovernanceDRepReq): Promise<PaginatedResult<GovernanceVoteRes>>;
}
```

## Acceptance Criteria

- [ ] Governance request/response types defined in `provider-core`
- [ ] Optional methods added to `ChainProvider` interface
- [ ] `DolosProvider` implements all 6 methods using `CardanoGovernanceApi`
- [ ] TypeScript compilation passes
- [ ] Existing code unaffected

## Dependencies

- `@laceanatomy/blockfrost-sdk` (already exists)

## Dependents

- #07 (governance page)
- #09 Phase 3 (DRep search detection)

## Notes

- This is intentionally separate from #01-a so governance can ship later.
- If Blockfrost governance endpoints are not yet stable, this issue can be deferred.
