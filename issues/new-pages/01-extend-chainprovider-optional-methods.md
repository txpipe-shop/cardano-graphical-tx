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

## Proposed Design

### New optional methods on `ChainProvider`

```ts
// packages/provider-core/src/index.ts

export type TokenReq = { unit: Unit };  // policyId + assetName
export type TokensReq = PaginatedRequest<undefined>;

export type TokenRes = {
  unit: Unit;
  policyId: string;
  assetName: string;
  fingerprint: string;
  quantity: string;
  initialMintTxHash: string;
  mintOrBurnCount: number;
  onchainMetadata?: unknown;
  offchainMetadata?: TokenMetadata;
};

export type TokenMetadata = {
  name?: string;
  description?: string;
  ticker?: string;
  url?: string;
  logo?: string;
  decimals?: number;
};

export type TokenHoldersReq = PaginatedRequest<{ unit: Unit }>;
export type TokenHolderRes = { address: Address; quantity: string };

export type ScriptReq = { hash: Hash };
export type ScriptsReq = PaginatedRequest<undefined>;
export type ScriptRes = {
  hash: Hash;
  type: 'timelock' | 'plutusV1' | 'plutusV2' | 'plutusV3';
  serialisedSize?: number;
  cbor?: string;
  json?: unknown;
};

export type ScriptRedeemersReq = PaginatedRequest<{ hash: Hash }>;
export type ScriptRedeemerRes = {
  txHash: Hash;
  txIndex: number;
  purpose: string;
  redeemerDataHash: string;
  unitMem: string;
  unitSteps: string;
  fee: string;
};

export type GovernanceDRepReq = { id: string };
export type GovernanceDRepsReq = PaginatedRequest<undefined>;
export type GovernanceDRepRes = {
  drepId: string;
  hex: string;
  amount: string;
  active: boolean;
  hasScript: boolean;
  retired?: boolean;
  expired?: boolean;
  lastActiveEpoch?: number;
};

export type GovernanceProposalReq = { txHash: Hash; certIndex: number };
export type GovernanceProposalsReq = PaginatedRequest<undefined>;
export type GovernanceProposalRes = {
  txHash: Hash;
  certIndex: number;
  governanceType: 'hard_fork_initiation' | 'new_committee' | 'new_constitution' |
                    'info_action' | 'no_confidence' | 'parameter_change' |
                    'treasury_withdrawals';
  description?: string;
  deposit: string;
  returnAddress: string;
  ratifiedEpoch?: number;
  enactedEpoch?: number;
  droppedEpoch?: number;
  expiredEpoch?: number;
  expiration: number;
  metadata?: { url: string; hash: string; json?: unknown };
};

export type GovernanceVoteRes = {
  voterRole: 'constitutional_committee' | 'drep' | 'spo';
  voter: string;
  vote: 'yes' | 'no' | 'abstain';
};

export type ProtocolParamsReq = { epoch?: bigint };
export type ProtocolParamsRes = {
  epoch?: number;
  minFeeA: number;
  minFeeB: number;
  maxBlockSize: number;
  maxTxSize: number;
  keyDeposit: string;
  poolDeposit: string;
  priceMem: number;
  priceStep: number;
  maxTxExMem: string;
  maxTxExSteps: string;
  maxBlockExMem: string;
  maxBlockExSteps: string;
  maxValSize: string;
  collateralPercent: number;
  maxCollateralInputs: number;
  coinsPerUtxoSize: string;
  costModels: unknown;
  // Conway governance params
  govActionLifetime?: number;
  govActionDeposit?: string;
  drepDeposit?: string;
  drepActivity?: number;
  committeeMinSize?: number;
  committeeMaxTermLength?: number;
};
```

### Extended interface

```ts
export interface ChainProvider<U extends UTxO, T extends Tx<U>, Chain extends BaseChain<U, T>> {
  // ... existing 13 methods ...

  // New optional methods
  getToken?(params: TokenReq): Promise<TokenRes>;
  getTokens?(params: TokensReq): Promise<PaginatedResult<TokenRes>>;
  getTokenHolders?(params: TokenHoldersReq): Promise<PaginatedResult<TokenHolderRes>>;
  getScript?(params: ScriptReq): Promise<ScriptRes>;
  getScripts?(params: ScriptsReq): Promise<PaginatedResult<ScriptRes>>;
  getScriptRedeemers?(params: ScriptRedeemersReq): Promise<PaginatedResult<ScriptRedeemerRes>>;
  getDRep?(params: GovernanceDRepReq): Promise<GovernanceDRepRes>;
  getDReps?(params: GovernanceDRepsReq): Promise<PaginatedResult<GovernanceDRepRes>>;
  getProposal?(params: GovernanceProposalReq): Promise<GovernanceProposalRes>;
  getProposals?(params: GovernanceProposalsReq): Promise<PaginatedResult<GovernanceProposalRes>>;
  getProposalVotes?(params: GovernanceProposalReq): Promise<PaginatedResult<GovernanceVoteRes>>;
  getDRepVotes?(params: GovernanceDRepReq): Promise<PaginatedResult<GovernanceVoteRes>>;
  getProtocolParams?(params: ProtocolParamsReq): Promise<ProtocolParamsRes>;
}
```

### Implementation in DolosProvider

Each new method maps Blockfrost SDK calls to the provider interface types. Example:

```ts
// cardano-provider-dolos/src/index.ts

private getBlockfrost(): { blocks: CardanoBlocksApi; addresses: CardanoAddressesApi;
                          assets: CardanoAssetsApi; scripts: CardanoScriptsApi;
                          governance: CardanoGovernanceApi; epochs: CardanoEpochsApi } {
  // Create Blockfrost API instances with the configured URL and API key
}

async getToken(params: TokenReq): Promise<TokenRes> {
  const { assets } = this.getBlockfrost();
  const asset = await assets.assetsAssetGet(params.unit);
  return { /* map Asset → TokenRes */ };
}

async getTokens(params: TokensReq): Promise<PaginatedResult<TokenRes>> {
  const { assets } = this.getBlockfrost();
  const result = await assets.assetsGet(...);
  return { data: result.map(mapAssetToToken), total: /* ... */ };
}
```

### What about DbSyncProvider?

DbSyncProvider can implement these methods with SQL queries (the DB schema has `multi_asset`, `script`, `drep_hash`, `gov_action_proposal`, etc. tables). This is tracked as a separate follow-up.

### What about U5CProvider?

U5CProvider will throw "not supported" for these methods (UTxO RPC doesn't expose assets, scripts, or governance directly).

## Approach decision

Since the user wants pages BEFORE the multi-chain refactor, we have two approaches:

**Option A (Recommended for speed)**: Server component pages call Blockfrost SDK directly, skip adding to ChainProvider until the multi-chain refactor.

**Option B**: Add to ChainProvider now, implement in DolosProvider, pages use provider interface.

**For this issue, pick Option B for the official path, but note that server components can also fall back to direct Blockfrost calls for rapid iteration.** The key win of Option A is not touching 3 provider packages for each new method.

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
