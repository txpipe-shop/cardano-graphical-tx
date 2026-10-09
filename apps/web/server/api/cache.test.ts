import { afterEach, describe, expect, it, vi } from "vitest";
import { ByteLru } from "./cache";

describe("ByteLru", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("evicts the least recently used entries to stay under the byte cap", () => {
    const cache = new ByteLru(30);
    cache.set("a", "x".repeat(10));
    cache.set("b", "x".repeat(10));
    cache.set("c", "x".repeat(10));
    cache.get("a");
    cache.set("d", "x".repeat(10));

    expect(cache.bytes).toBe(30);
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("a")).toBeDefined();
    expect(cache.get("c")).toBeDefined();
    expect(cache.get("d")).toBeDefined();

    for (let i = 0; i < 100; i++) {
      cache.set(`k${i}`, "y".repeat(1 + (i % 13)));
      expect(cache.bytes).toBeLessThanOrEqual(30);
    }
  });

  it("counts serialized bytes, not characters", () => {
    const cache = new ByteLru(100);
    cache.set("a", "é".repeat(10));
    expect(cache.bytes).toBe(20);
  });

  it("never stores an entry larger than the cap", () => {
    const cache = new ByteLru(10);
    cache.set("small", "x".repeat(5));
    cache.set("big", "x".repeat(11));
    expect(cache.get("big")).toBeUndefined();
    expect(cache.get("small")).toBeDefined();
    expect(cache.bytes).toBe(5);
  });

  it("replacing a key releases its old bytes", () => {
    const cache = new ByteLru(100);
    cache.set("a", "x".repeat(40));
    cache.set("a", "x".repeat(10));
    expect(cache.bytes).toBe(10);
    expect(cache.size).toBe(1);
  });

  it("expires TTL entries", () => {
    vi.useFakeTimers();
    const cache = new ByteLru(100);
    cache.set("short", "x", 1_000);
    cache.set("forever", "y");

    vi.advanceTimersByTime(999);
    expect(cache.get("short")).toBe("x");

    vi.advanceTimersByTime(1);
    expect(cache.get("short")).toBeUndefined();
    expect(cache.get("forever")).toBe("y");
    expect(cache.bytes).toBe(1);
  });
});
