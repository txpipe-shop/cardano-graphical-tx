import { afterEach, describe, expect, it, vi } from 'vitest';
import fetch from 'cross-fetch';
import { TokenRegistryClient } from '../src/index';

vi.mock('cross-fetch', () => ({ default: vi.fn() }));

const FAKE_SUBJECT = '00000000000000000000000000000000000000000000000000000000';

describe('TokenRegistryClient unknown subject', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  for (const status of [204, 404]) {
    it(`returns null without a warning on ${status}`, async () => {
      vi.mocked(fetch).mockResolvedValue(new Response(null, { status }));
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const metadata = await new TokenRegistryClient('mainnet').getToken(FAKE_SUBJECT);

      expect(metadata).toBeNull();
      expect(warn).not.toHaveBeenCalled();
    });
  }
});
