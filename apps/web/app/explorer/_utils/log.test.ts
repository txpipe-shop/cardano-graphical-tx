import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { describeUpstreamError } from "./log";

describe("describeUpstreamError", () => {
  it("describes an axios timeout in one line", () => {
    const error = new AxiosError(
      "timeout of 15000ms exceeded",
      "ECONNABORTED",
      {
        method: "get",
        url: "http://minibf:3000/addresses/addr1x/transactions?count=21",
      } as never,
    );

    const line = describeUpstreamError(error);

    expect(line).toBe(
      "GET /addresses/addr1x/transactions?count=21 ECONNABORTED: timeout of 15000ms exceeded",
    );
    expect(line).not.toContain("\n");
  });

  it("prefers the response status", () => {
    const error = new AxiosError(
      "Request failed with status code 404",
      "ERR_BAD_REQUEST",
      {
        method: "get",
        url: "http://minibf:3000/assets/abc",
      } as never,
      null,
      { status: 404 } as never,
    );

    expect(describeUpstreamError(error)).toBe(
      "GET /assets/abc 404: Request failed with status code 404",
    );
  });

  it("describes a connect-rpc error", () => {
    const error = Object.assign(
      new Error("[deadline_exceeded] the operation timed out"),
      {
        name: "ConnectError",
        code: 4,
      },
    );

    expect(describeUpstreamError(error)).toBe(
      "gRPC 4: [deadline_exceeded] the operation timed out",
    );
  });

  it("leaves other errors to be logged in full", () => {
    expect(
      describeUpstreamError(
        new Error("A hex string must contain only hexadecimal characters"),
      ),
    ).toBeNull();
    expect(describeUpstreamError("boom")).toBeNull();
  });
});
