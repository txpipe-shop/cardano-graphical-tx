type Entry = { value: string; bytes: number; expiresAt: number };

/**
 * An LRU of serialized values whose total byte size never exceeds `maxBytes`.
 * Entries may carry a TTL; an expired entry is dropped when it is next read.
 */
export class ByteLru {
  private readonly entries = new Map<string, Entry>();
  private total = 0;

  constructor(readonly maxBytes: number) {}

  get bytes(): number {
    return this.total;
  }

  get size(): number {
    return this.entries.size;
  }

  get(key: string): string | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.delete(key);
      return undefined;
    }
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry.value;
  }

  set(key: string, value: string, ttlMs = Infinity): void {
    const bytes = Buffer.byteLength(value);
    this.delete(key);
    if (bytes > this.maxBytes) return;

    while (this.total + bytes > this.maxBytes) {
      const oldest = this.entries.keys().next().value as string;
      this.delete(oldest);
    }
    this.entries.set(key, { value, bytes, expiresAt: Date.now() + ttlMs });
    this.total += bytes;
  }

  private delete(key: string): void {
    const entry = this.entries.get(key);
    if (!entry) return;
    this.entries.delete(key);
    this.total -= entry.bytes;
  }
}
