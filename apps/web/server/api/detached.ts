import { AsyncResource } from "node:async_hooks";

/**
 * Node's AsyncLocalStorage copies the current request's store onto every
 * promise, timer and socket created while the request runs. Upstream clients
 * keep some of those alive after the request ends: pooled keep-alive sockets,
 * timers, and settled promises in shared caches. Each then keeps its
 * request's whole Next store (render state, React cache, every upstream
 * response) alive. Heap snapshots on 2026-10-12 found hundreds of finished
 * requests retained that way, enough to fill the heap.
 *
 * Upstream calls therefore run in a scope that carries no request store. The
 * scope must be created outside any request: `instrumentation.ts` creates it
 * at server start, because Next loads this module lazily inside the first
 * request.
 */
const SCOPE_KEY = Symbol.for("laceanatomy.upstreamScope");

type ScopeHolder = { [SCOPE_KEY]?: AsyncResource };

export function createUpstreamScope(): void {
  const holder = globalThis as ScopeHolder;
  holder[SCOPE_KEY] ??= new AsyncResource("laceanatomy.upstream");
}

function upstreamScope(): AsyncResource {
  const holder = globalThis as ScopeHolder;
  // Without instrumentation (tests, scripts) the scope is created on first use.
  holder[SCOPE_KEY] ??= new AsyncResource("laceanatomy.upstream");
  return holder[SCOPE_KEY];
}

/** What callers read from an upstream failure, without the request objects. */
export class UpstreamError extends Error {
  code?: string | number;
  status?: number;
  response?: { status: number };
  config?: { method?: string; url?: string };

  constructor(source: {
    name?: string;
    message: string;
    code?: string | number;
    status?: number;
    method?: string;
    url?: string;
  }) {
    super(source.message);
    this.name = source.name ?? "UpstreamError";
    this.code = source.code;
    this.status = source.status;
    if (source.status !== undefined) this.response = { status: source.status };
    if (source.method || source.url) {
      this.config = { method: source.method, url: source.url };
    }
  }
}

/**
 * An axios error holds its request, response and socket, and through the
 * socket a request store. Keep only what the pages and logs read.
 */
export function toPlainUpstreamError(error: unknown): unknown {
  if (typeof error !== "object" || error === null) return error;
  const e = error as {
    isAxiosError?: boolean;
    name?: string;
    message?: string;
    code?: string;
    status?: number;
    response?: { status?: number };
    config?: { method?: string; url?: string };
  };
  if (!e.isAxiosError) return error;
  return new UpstreamError({
    name: e.name,
    message: e.message ?? "upstream request failed",
    code: e.code,
    status: e.response?.status ?? e.status,
    method: e.config?.method,
    url: e.config?.url,
  });
}

/** Runs every method of `provider` in the upstream scope, with plain errors. */
export function detachUpstream<P extends object>(provider: P): P {
  return new Proxy(provider, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (typeof value !== "function") return value;
      return (...args: unknown[]) =>
        upstreamScope().runInAsyncScope(() =>
          Promise.resolve()
            .then(() => value.apply(target, args))
            .catch((error: unknown) => {
              throw toPlainUpstreamError(error);
            }),
        );
    },
  });
}
