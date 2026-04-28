# 01-c — Extend `ChainProvider` with Protocol Parameters Method

## Summary

Add an optional protocol parameters method to `ChainProvider` in `@laceanatomy/provider-core`, and implement it in `DolosProvider` via Blockfrost SDK.

## Motivation

The protocol parameters page (#06) needs a provider method to fetch current and historical protocol parameters.

## Method

```ts
export interface ChainProvider<...> {
  getProtocolParams?(params: ProtocolParamsReq): Promise<ProtocolParamsRes>;
}
```

Where `ProtocolParamsReq` allows querying by epoch:
```ts
type ProtocolParamsReq = { epoch?: bigint };
```

## Acceptance Criteria

- [ ] `ProtocolParamsReq` and `ProtocolParamsRes` types defined in `provider-core`
- [ ] Optional method added to `ChainProvider` interface
- [ ] `DolosProvider` implements `getProtocolParams` using `CardanoEpochsApi`
- [ ] Returns current epoch params when no epoch specified
- [ ] TypeScript compilation passes
- [ ] Existing code unaffected

## Dependencies

- `@laceanatomy/blockfrost-sdk` (already exists)

## Dependents

- #06 (protocol params page)
- #09 Phase 3 (epoch search detection)

## Notes

- This is a single method and can ship quickly.
- The `ProtocolParamsRes` type should expose raw params; formatting is a UI concern.
