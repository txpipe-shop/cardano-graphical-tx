type UpstreamErrorShape = {
  name?: unknown;
  message?: unknown;
  code?: unknown;
  status?: unknown;
  response?: { status?: unknown };
  config?: { method?: unknown; url?: unknown };
};

function requestPath(url: unknown): string {
  if (typeof url !== "string") return "";
  try {
    const { pathname, search } = new URL(url);
    return pathname + search;
  } catch {
    return url;
  }
}

/**
 * One line for an upstream failure (axios or connect-rpc), or null for any
 * other error. Logging an axios error itself dumps its whole request and
 * socket, about 160 lines.
 */
export function describeUpstreamError(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const e = error as UpstreamErrorShape;

  if (e.config && typeof e.config === "object") {
    const method =
      typeof e.config.method === "string" ? e.config.method.toUpperCase() : "";
    const status = e.response?.status ?? e.status ?? e.code ?? "";
    return `${method} ${requestPath(e.config.url)} ${status}: ${String(e.message)}`;
  }
  if (e.name === "ConnectError") {
    return `gRPC ${String(e.code)}: ${String(e.message)}`;
  }
  return null;
}

/** Logs upstream failures in one line, and anything else with its stack. */
export function logError(context: string, error: unknown) {
  const upstream = describeUpstreamError(error);
  if (upstream) console.error(`${context}: ${upstream}`);
  else console.error(context, error);
}
