/** Runs once at server start, before any request. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { createUpstreamScope } = await import("./server/api/detached");
    createUpstreamScope();
  }
}
