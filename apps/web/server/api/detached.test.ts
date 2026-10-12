import { AxiosError } from "axios";
import { AsyncLocalStorage } from "node:async_hooks";
import { describe, expect, it } from "vitest";
import {
  UpstreamError,
  createUpstreamScope,
  detachUpstream,
  toPlainUpstreamError,
} from "./detached";

// As instrumentation.ts does at server start: outside any request.
createUpstreamScope();

describe("detachUpstream", () => {
  it("runs provider calls without the caller's request store", async () => {
    const als = new AsyncLocalStorage<{ request: string }>();
    const provider = detachUpstream({
      async storeSeen() {
        await new Promise((resolve) => setTimeout(resolve, 1));
        return als.getStore();
      },
    });

    const seen = await als.run({ request: "a" }, () => provider.storeSeen());

    expect(seen).toBeUndefined();
  });

  it("turns axios errors into plain errors that keep what callers read", async () => {
    const provider = detachUpstream({
      async fail() {
        throw new AxiosError(
          "Request failed with status code 404",
          "ERR_BAD_REQUEST",
          { method: "get", url: "http://minibf/assets/abc" } as never,
          { socket: "pretend" },
          { status: 404 } as never,
        );
      },
    });

    const error = await provider.fail().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(UpstreamError);
    expect(error).toMatchObject({
      message: "Request failed with status code 404",
      code: "ERR_BAD_REQUEST",
      status: 404,
      response: { status: 404 },
      config: { method: "get", url: "http://minibf/assets/abc" },
    });
    expect(error).not.toHaveProperty("request");
  });

  it("leaves other errors untouched", () => {
    const error = new Error("boom");
    expect(toPlainUpstreamError(error)).toBe(error);
  });
});
