import type { DolosProvider } from "@laceanatomy/cardano-provider-dolos";
import type { BlockReq } from "@laceanatomy/provider-core";
import superjson from "superjson";
import type { ByteLru } from "./cache";

/** Cardano's security parameter: blocks deeper than this below the tip are final. */
export const SECURITY_PARAM = 2160n;

export type CacheableProvider = Pick<
  DolosProvider,
  | "readTip"
  | "getTx"
  | "getCBOR"
  | "getTxs"
  | "getBlocksWithTxs"
  | "getBlockCBOR"
  | "getAddressFunds"
  | "getAddressUTxOs"
  | "getAssetInfo"
  | "getAssetHolders"
  | "getAssetHistory"
  | "getAssetTxs"
  | "getTokenMetadata"
>;

export type UpstreamCacheOptions = {
  /** Prefixes every key, so networks can share the same caches. */
  network: string;
  /** Final chain data: never expires, evicted by LRU. */
  immutable: ByteLru;
  /** Everything else, kept for `ttlMs`. */
  mutable: ByteLru;
  ttlMs: number;
  /** Called with the key of every lookup that goes to the upstream. */
  onUpstream?: (key: string) => void;
};

/**
 * Where a loaded value is stored: always final, short-lived, or decided by the
 * depth of the block it sits in. A `null` height marks a miss, which is never
 * stored; `"mutable"` keeps an incomplete value from being stored as final.
 */
type Placement<T> =
  | "immutable"
  | "mutable"
  | ((value: T) => bigint | "mutable" | null);

function blockKey(ref: BlockReq): string {
  if ("hash" in ref) return `hash:${ref.hash}`;
  if ("height" in ref) return `height:${ref.height}`;
  return `slot:${ref.slot}`;
}

/**
 * Serves the provider's lookups from in-process caches. Values are stored
 * serialized, so the byte caps bound the memory they hold and every caller
 * gets its own copy. Concurrent misses share one upstream call; errors are
 * never stored.
 */
export function withUpstreamCache<P extends CacheableProvider>(
  provider: P,
  { network, immutable, mutable, ttlMs, onUpstream }: UpstreamCacheOptions,
): P {
  const inFlight = new Map<string, Promise<string>>();
  let tip: { height: bigint; expiresAt: number } | undefined;
  let tipInFlight: Promise<bigint> | undefined;

  // Blocks more than k below any tip ever observed are final, so a stale tip is safe.
  function tipHeight(): Promise<bigint> {
    if (tip && tip.expiresAt > Date.now()) return Promise.resolve(tip.height);
    tipInFlight ??= provider
      .readTip()
      .then(({ height }) => {
        tip = { height, expiresAt: Date.now() + ttlMs };
        return height;
      })
      .finally(() => {
        tipInFlight = undefined;
      });
    return tipInFlight;
  }

  async function load<T>(
    key: string,
    fetch: () => Promise<T>,
    placement: Placement<T>,
  ): Promise<string> {
    const [value, tipNow] = await Promise.all([
      fetch(),
      typeof placement === "function"
        ? tipHeight().catch(() => undefined)
        : undefined,
    ]);
    const serialized = superjson.stringify(value);

    if (placement === "immutable") {
      immutable.set(key, serialized);
    } else if (placement === "mutable") {
      mutable.set(key, serialized, ttlMs);
    } else {
      const height = placement(value);
      if (height === null) return serialized;
      if (
        height !== "mutable" &&
        tipNow !== undefined &&
        tipNow - height > SECURITY_PARAM
      ) {
        immutable.set(key, serialized);
      } else {
        mutable.set(key, serialized, ttlMs);
      }
    }
    return serialized;
  }

  async function lookup<T>(
    id: string,
    fetch: () => Promise<T>,
    placement: Placement<T>,
  ): Promise<T> {
    const key = `${network}:${id}`;
    const hit = immutable.get(key) ?? mutable.get(key);
    if (hit !== undefined) return superjson.parse<T>(hit);

    let pending = inFlight.get(key);
    if (!pending) {
      onUpstream?.(key);
      pending = load(key, fetch, placement).finally(() => inFlight.delete(key));
      inFlight.set(key, pending);
    }
    return superjson.parse<T>(await pending);
  }

  function short<A extends unknown[], T>(
    method: string,
    fetch: (...args: A) => Promise<T>,
  ): (...args: A) => Promise<T> {
    return (...args) =>
      lookup(
        `${method}:${superjson.stringify(args)}`,
        () => fetch(...args),
        "mutable",
      );
  }

  const addressTxs = short("address-txs", provider.getTxs.bind(provider));

  const cached: Partial<CacheableProvider> = {
    getTx: (req) =>
      lookup(
        `tx:${req.hash}`,
        () => provider.getTx(req),
        // The provider leaves the index unset when its lookup fails.
        (tx) => (tx.indexInBlock === undefined ? "mutable" : tx.block.height),
      ),
    getCBOR: (req) =>
      lookup(`tx-cbor:${req.hash}`, () => provider.getCBOR(req), "immutable"),
    getBlocksWithTxs: (req) =>
      req.cursor && req.limit === 1n
        ? lookup(
            `block:${blockKey(req.cursor)}`,
            () => provider.getBlocksWithTxs(req),
            (res) => res.data[0]?.block.height ?? null,
          )
        : provider.getBlocksWithTxs(req),
    getBlockCBOR: (req) =>
      lookup(
        `block-cbor:${blockKey(req)}`,
        () => provider.getBlockCBOR(req),
        "hash" in req
          ? "immutable"
          : "height" in req
            ? () => req.height
            : "mutable",
      ),
    getTxs: (req) =>
      req.query?.address ? addressTxs(req) : provider.getTxs(req),
    getAddressFunds: short(
      "address-funds",
      provider.getAddressFunds.bind(provider),
    ),
    getAddressUTxOs: short(
      "address-utxos",
      provider.getAddressUTxOs.bind(provider),
    ),
    getAssetInfo: short("asset", provider.getAssetInfo.bind(provider)),
    getAssetHolders: short(
      "asset-holders",
      provider.getAssetHolders.bind(provider),
    ),
    getAssetHistory: short(
      "asset-history",
      provider.getAssetHistory.bind(provider),
    ),
    getAssetTxs: short("asset-txs", provider.getAssetTxs.bind(provider)),
    getTokenMetadata: short(
      "token-metadata",
      provider.getTokenMetadata.bind(provider),
    ),
  };

  // Everything not overridden falls through to the provider itself.
  return Object.assign(Object.create(provider) as P, cached);
}
