import { afterEach, describe, expect, it, vi } from 'vitest';
import fetch from 'cross-fetch';
import { TokenRegistryClient } from '../src/index';

vi.mock('cross-fetch', () => ({ default: vi.fn() }));

const SUBJECT = '00000000000000000000000000000000000000000000000000000000';

describe('TokenRegistryClient rate limit', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.mocked(fetch).mockReset();
  });

  it('pauses lookups after a 429, then resumes', async () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 429 }));
    const client = new TokenRegistryClient('mainnet');

    expect(await client.getToken(SUBJECT)).toBeNull();
    expect(await client.getToken(SUBJECT)).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5 * 60 * 1000);
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    expect(await client.getToken(SUBJECT)).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
