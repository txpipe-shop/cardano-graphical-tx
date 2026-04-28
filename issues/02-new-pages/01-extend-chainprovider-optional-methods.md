# 01 — Extend `ChainProvider` with New Optional Methods for Explorer Pages

## Summary

Add optional methods to the `ChainProvider` interface in `@laceanatomy/provider-core` to support the new explorer pages (scripts, tokens, governance, protocol parameters). Implement them in `DolosProvider` using the already-generated Blockfrost SDK classes.

## Motivation

The current `ChainProvider` interface covers blocks, transactions, addresses, epochs, and (optionally) pools. New explorer pages need:

| Page | Data needed | Blockfrost API |
|------|------------|----------------|
| Token/Asset detail | Asset info, holders, history, transactions | `CardanoAssetsApi` |
| Script detail | Script info, CBOR/JSON, redeemers | `CardanoScriptsApi` |
| Governance (proposals, DReps, votes) | Proposal list/detail, DRep list/detail, votes | `CardanoGovernanceApi` |
| Protocol parameters | Current params, epoch params, param change proposals | `CardanoEpochsApi` |

These APIs are **fully generated** in `@laceanatomy/blockfrost-sdk` but never wired into any provider.

### Extended interface

```ts
export interface ChainProvider<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> {
  // New optional methods
  getToken?(params: TokenReq): Promise<TokenRes>;
  getTokens?(params: TokensReq): Promise<PaginatedResult<TokenRes>>;
  getTokenHolders?(params: TokenHoldersReq): Promise<PaginatedResult<TokenHolderRes>>;
  getScript?(params: ScriptReq): Promise<ScriptRes>;
  getScripts?(params: ScriptsReq): Promise<PaginatedResult<ScriptRes>>;
  getDRep?(params: GovernanceDRepReq): Promise<GovernanceDRepRes>;
  getDReps?(params: GovernanceDRepsReq): Promise<PaginatedResult<GovernanceDRepRes>>;
  getProposal?(params: GovernanceProposalReq): Promise<GovernanceProposalRes>;
  getProposals?(params: GovernanceProposalsReq): Promise<PaginatedResult<GovernanceProposalRes>>;
  getProposalVotes?(params: GovernanceProposalReq): Promise<PaginatedResult<GovernanceVoteRes>>;
  getDRepVotes?(params: GovernanceDRepReq): Promise<PaginatedResult<GovernanceVoteRes>>;
  getProtocolParams?(params: ProtocolParamsReq): Promise<ProtocolParamsRes>;
}
```

## Acceptance Criteria

- [ ] New request/response types defined in `@laceanatomy/provider-core`
- [ ] Optional methods added to `ChainProvider` interface
- [ ] `DolosProvider` implements new methods using Blockfrost SDK
- [ ] TypeScript compilation passes
- [ ] Existing code unaffected by optional method additions

## Dependencies

- `@laceanatomy/blockfrost-sdk` (already exists, fully generated)
- `@laceanatomy/provider-core` (modified here)

## Dependents

- #03 (address page)
- #04 (script page)
- #05 (token page)
- #06 (protocol params page)
- #07 (governance page)
- #10 (epochs page)
- #11 (pools page)
- #12 (dreps page)
