# 01-a — Extend `ChainProvider` with Token & Script Methods

## Summary

Add optional methods for token/asset and script data to `ChainProvider` in `@laceanatomy/provider-core`, and implement them in `DolosProvider` via Blockfrost SDK.

## Motivation

The token detail page (#05) and script detail page (#04) need provider methods to fetch asset metadata, holder lists, history, and script details with redeemers.

## Methods

```ts
export interface ChainProvider<...> {
  // Token / Asset methods
  getToken?(params: TokenReq): Promise<TokenRes>;
  getTokens?(params: TokensReq): Promise<PaginatedResult<TokenRes>>;
  getTokenHolders?(params: TokenHoldersReq): Promise<PaginatedResult<TokenHolderRes>>;

  // Script methods
  getScript?(params: ScriptReq): Promise<ScriptRes>;
  getScripts?(params: ScriptsReq): Promise<PaginatedResult<ScriptRes>>;
}
```

## Acceptance Criteria

- [ ] Token request/response types (`TokenReq`, `TokenRes`, `TokenHoldersReq`, `TokenHolderRes`) defined in `provider-core`
- [ ] Script request/response types (`ScriptReq`, `ScriptRes`) defined in `provider-core`
- [ ] Optional methods added to `ChainProvider` interface
- [ ] `DolosProvider` implements all 5 methods using `CardanoAssetsApi` and `CardanoScriptsApi`
- [ ] TypeScript compilation passes
- [ ] Existing code unaffected

## Dependencies

- `@laceanatomy/blockfrost-sdk` (already exists)

## Dependents

- #04 (script page)
- #05 (token page)
- #09 Phase 2 (token/script search detection)
