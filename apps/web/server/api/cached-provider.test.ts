import type { DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ByteLru } from "./cache";
import { SECURITY_PARAM, withUpstreamCache } from "./cached-provider";

const TIP = 10_000n;
const TTL_MS = 30_000;

function fakeProvider() {
  const calls: string[] = [];
  const failing = new Set<string>();
  let tipFails = false;

  const call = async <T>(name: string, value: () => T): Promise<T> => {
    calls.push(name);
    if (failing.has(name)) throw new Error(`${name} failed`);
    return value();
  };

  const provider = {
    tipFails: (fails: boolean) => {
      tipFails = fails;
    },
    readTip: () =>
      call("readTip", () => {
        if (tipFails) throw new Error("tip unavailable");
        return { hash: "tip", slot: 0n, height: TIP };
      }),
    getTx: ({ hash }: { hash: string }) =>
      call(`getTx:${hash}`, () => ({
        hash,
        fee: 170_000n,
        indexInBlock: hash.startsWith("unindexed") ? undefined : 0n,
        block: { hash: "b", slot: 1n, height: BigInt(hash.split("@")[1] ?? 0) },
      })),
    getCBOR: ({ hash }: { hash: string }) =>
      call(`getCBOR:${hash}`, () => "84a400"),
    getBlocksWithTxs: ({ cursor }: { cursor?: { height: bigint } }) =>
      call(`getBlocksWithTxs:${cursor?.height}`, () => ({
        data:
          cursor && cursor.height <= TIP
            ? [{ block: { height: cursor.height, fees: 1n }, transactions: [] }]
            : [],
      })),
    getBlockCBOR: (req: { height: bigint } | { hash: string }) =>
      call(`getBlockCBOR:${"hash" in req ? req.hash : req.height}`, () => "82"),
    getAssetInfo: (asset: string) =>
      call(`getAssetInfo:${asset}`, () => ({ asset, totalSupply: "1" })),
    getBlocks: () => call("getBlocks", () => ({ data: [], total: 0n })),
    getTxs: () => call("getTxs", () => ({ data: [], total: 0n })),
    getAddressFunds: () => call("getAddressFunds", () => ({})),
    getAddressUTxOs: () => call("getAddressUTxOs", () => ({})),
    getAssetHolders: () => call("getAssetHolders", () => []),
    getAssetHistory: () => call("getAssetHistory", () => []),
    getAssetTxs: () => call("getAssetTxs", () => []),
    getTokenMetadata: () => call("getTokenMetadata", () => ({})),
  };

  return { provider, calls, failing };
}

function setup() {
  const fake = fakeProvider();
  const immutable = new ByteLru(1_000_000);
  const mutable = new ByteLru(1_000_000);
  const upstream: string[] = [];
  const cached = withUpstreamCache(fake.provider as unknown as DolosProvider, {
    network: "mainnet",
    immutable,
    mutable,
    ttlMs: TTL_MS,
    onUpstream: (key) => upstream.push(key),
  });
  return { ...fake, cached, immutable, mutable, upstream };
}

const count = (calls: string[], name: string) =>
  calls.filter((call) => call === name).length;

describe("withUpstreamCache", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stores deep txs as final and round-trips bigints", async () => {
    const { cached, calls, immutable, mutable } = setup();
    const hash = `deep@${TIP - SECURITY_PARAM - 1n}` as never;

    const first = await cached.getTx({ hash });
    const second = await cached.getTx({ hash });

    expect(count(calls, `getTx:${hash}`)).toBe(1);
    expect(second).toEqual(first);
    expect(second.fee).toBe(170_000n);
    expect(immutable.size).toBe(1);
    expect(mutable.size).toBe(0);
  });

  it("never stores blocks within the security parameter as final", async () => {
    const { cached, immutable, mutable } = setup();

    for (const depth of [0n, 1n, 100n, SECURITY_PARAM]) {
      const height = TIP - depth;
      await cached.getBlocksWithTxs({ cursor: { height }, limit: 1n });
      await cached.getBlockCBOR({ height });
      await cached.getTx({ hash: `tx@${height}` as never });
    }
    expect(immutable.size).toBe(0);
    expect(mutable.size).toBe(12);

    const deep = TIP - SECURITY_PARAM - 1n;
    await cached.getBlocksWithTxs({ cursor: { height: deep }, limit: 1n });
    await cached.getBlockCBOR({ height: deep });
    expect(immutable.size).toBe(2);
  });

  it("never stores a tx without its in-block index as final", async () => {
    const { cached, calls, immutable, mutable } = setup();
    const hash = `unindexed@${TIP - SECURITY_PARAM - 1n}` as never;

    await cached.getTx({ hash });
    await cached.getTx({ hash });
    expect(count(calls, `getTx:${hash}`)).toBe(1);
    expect(immutable.size).toBe(0);
    expect(mutable.size).toBe(1);
  });

  it("stores content-addressed lookups as final regardless of depth", async () => {
    const { cached, immutable } = setup();
    await cached.getCBOR({ hash: "tip-tx" as never });
    await cached.getBlockCBOR({ hash: "tip-block" as never });
    expect(immutable.size).toBe(2);
  });

  it("expires short-lived entries", async () => {
    vi.useFakeTimers();
    const { cached, calls } = setup();

    await cached.getAssetInfo("unit");
    vi.advanceTimersByTime(TTL_MS - 1);
    await cached.getAssetInfo("unit");
    expect(count(calls, "getAssetInfo:unit")).toBe(1);

    vi.advanceTimersByTime(1);
    await cached.getAssetInfo("unit");
    expect(count(calls, "getAssetInfo:unit")).toBe(2);
  });

  it("does not store errors", async () => {
    const { cached, calls, failing, immutable, mutable } = setup();
    const hash = `missing@1` as never;
    failing.add(`getTx:${hash}`);

    await expect(cached.getTx({ hash })).rejects.toThrow("failed");
    await expect(cached.getTx({ hash })).rejects.toThrow("failed");
    expect(count(calls, `getTx:${hash}`)).toBe(2);

    failing.add("getAssetInfo:gone");
    await expect(cached.getAssetInfo("gone")).rejects.toThrow("failed");
    await expect(cached.getAssetInfo("gone")).rejects.toThrow("failed");
    expect(count(calls, "getAssetInfo:gone")).toBe(2);
    expect(immutable.size + mutable.size).toBe(0);
  });

  it("does not store misses", async () => {
    const { cached, calls, immutable, mutable } = setup();
    const height = TIP + 1n;

    await cached.getBlocksWithTxs({ cursor: { height }, limit: 1n });
    await cached.getBlocksWithTxs({ cursor: { height }, limit: 1n });
    expect(count(calls, `getBlocksWithTxs:${height}`)).toBe(2);
    expect(immutable.size + mutable.size).toBe(0);
  });

  it("serves a page and its images with one upstream call per lookup", async () => {
    const { cached, upstream } = setup();
    const hash = `viewed@${TIP - 5n}` as never;
    const view = () =>
      Promise.all([cached.getTx({ hash }), cached.getCBOR({ hash })]);

    await Promise.all([view(), view()]);
    await view();
    await view();

    expect(upstream).toEqual([`mainnet:tx:${hash}`, `mainnet:tx-cbor:${hash}`]);
  });

  it("gives every caller its own copy", async () => {
    const { cached } = setup();
    const first = await cached.getAssetInfo("unit");
    first.totalSupply = "mutated";
    expect((await cached.getAssetInfo("unit")).totalSupply).toBe("1");
  });

  it("keeps the value but not its depth when the tip is unavailable", async () => {
    const { cached, provider, immutable, mutable } = setup();
    provider.tipFails(true);
    const hash = `deep@1` as never;

    await expect(cached.getTx({ hash })).resolves.toMatchObject({ hash });
    expect(immutable.size).toBe(0);
    expect(mutable.size).toBe(1);
  });

  it("passes other methods through to the provider", async () => {
    const { cached, calls } = setup();
    await cached.getBlocks({ limit: 10n, offset: 0n, query: undefined });
    await cached.getBlocksWithTxs({ limit: 10n });
    await cached.getBlocksWithTxs({ limit: 10n });
    expect(count(calls, "getBlocks")).toBe(1);
    expect(count(calls, "getBlocksWithTxs:undefined")).toBe(2);
  });
});
