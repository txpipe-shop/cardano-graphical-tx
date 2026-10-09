import { createGrpcTransport } from "@laceanatomy/utxorpc-sdk/transport/node";
import { env } from "~/app/env.mjs";

function positiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** Default deadline for every UTxORPC call. */
export const UPSTREAM_GRPC_TIMEOUT_MS = positiveInt(
  env.UPSTREAM_GRPC_TIMEOUT_MS,
  15_000,
);

/** Timeout for minibf (axios) and server-side `fetch` calls. */
export const UPSTREAM_HTTP_TIMEOUT_MS = positiveInt(
  env.UPSTREAM_HTTP_TIMEOUT_MS,
  15_000,
);

/**
 * A long-lived HTTP/2 gRPC transport. Callers memoize it so each upstream
 * keeps a single session: a session unused for longer than the ping interval
 * is verified with a PING before reuse, and one idle for a minute is closed.
 */
export function createUpstreamTransport(
  baseUrl: string,
  headers?: Record<string, string>,
) {
  return createGrpcTransport({
    httpVersion: "2",
    baseUrl,
    defaultTimeoutMs: UPSTREAM_GRPC_TIMEOUT_MS,
    pingIntervalMs: 30_000,
    pingTimeoutMs: 10_000,
    idleConnectionTimeoutMs: 60_000,
    interceptors: headers
      ? [
          (next) => async (req) => {
            for (const [key, value] of Object.entries(headers)) {
              req.header.set(key, value);
            }
            return next(req);
          },
        ]
      : [],
  });
}

export function memoize<K, V>(create: (key: K) => V): (key: K) => V {
  const cache = new Map<K, V>();
  return (key) => {
    if (!cache.has(key)) cache.set(key, create(key));
    return cache.get(key)!;
  };
}
