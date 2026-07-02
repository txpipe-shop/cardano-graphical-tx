import { describe, it, expect } from 'vitest';
import { TokenRegistryClient } from '../src/index';

const MAINNET_SUBJECT = '29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e';
const MAINNET_POLICY = '82008200581c293153a7fb06d516b3ae3b8befc0db29284bbf2e5760b892602f0e4c';
const PREPROD_SUBJECT = 'ab49c4983ea2cfd43dcc32279c5ef045bb39d331309f7f0e98da939a7453554e444145';
const PREPROD_POLICY = '82008200581c98f6400f3995029dc0bcf3be62e52d95030d6d23809b9700361cbbdd';

const FAKE_SUBJECT = '00000000000000000000000000000000000000000000000000000000';

describe('TokenRegistryClient', () => {
  describe('mainnet', () => {
    const client = new TokenRegistryClient('mainnet');

    it('constructs the correct base URL', () => {
      expect(client['baseUrl']).toBe('https://tokens.cardano.org/metadata');
    });

    it('returns metadata for a known token', async () => {
      const m = await client.getToken(MAINNET_SUBJECT);
      expect(m).not.toBeNull();
      expect(m!.subject).toBe(MAINNET_SUBJECT);
      expect(m!.name).toBe('Minswap');
      expect(m!.description).toBe(
        'Minswap is a multi-pool decentralize exchange protocol on Cardano'
      );
      expect(m!.ticker).toBe('MIN');
      expect(m!.url).toBe('https://minswap.org/');
      expect(m!.decimals).toBe(6);
      expect(m!.policy).toBe(MAINNET_POLICY);
      expect(m!.logo).toBeTypeOf('string');
      expect(m!.logo!.length).toBeGreaterThan(100);
    });

    it('returns null for unknown token', async () => {
      const metadata = await client.getToken(FAKE_SUBJECT);
      expect(metadata).toBeNull();
    });

    it('getTokens batches correctly', async () => {
      const map = await client.getTokens([MAINNET_SUBJECT, FAKE_SUBJECT]);
      expect(map.size).toBe(1);
      expect(map.get(MAINNET_SUBJECT)).toBeTruthy();
      expect(map.get(FAKE_SUBJECT)).toBeUndefined();
    });
  });

  describe('preprod', () => {
    const client = new TokenRegistryClient('preprod');

    it('constructs the correct base URL', () => {
      expect(client['baseUrl']).toBe('https://preprod.tokens.cardano.org/metadata');
    });

    it('returns metadata for a known token', async () => {
      const m = await client.getToken(PREPROD_SUBJECT);
      expect(m).not.toBeNull();
      expect(m!.subject).toBe(PREPROD_SUBJECT);
      expect(m!.name).toBe('tSUNDAE');
      expect(m!.description).toContain('SundaeSwap is a decentralized exchange');
      expect(m!.ticker).toBe('tSUNDAE');
      expect(m!.url).toBe('https://sundaeswap.finance');
      expect(m!.decimals).toBe(6);
      expect(m!.policy).toBe(PREPROD_POLICY);
      expect(m!.logo).toBeTypeOf('string');
      expect(m!.logo!.length).toBeGreaterThan(100);
    });

    it('returns null for unknown token', async () => {
      const metadata = await client.getToken(FAKE_SUBJECT);
      expect(metadata).toBeNull();
    });

    it('getTokens batches correctly', async () => {
      const map = await client.getTokens([PREPROD_SUBJECT, FAKE_SUBJECT]);
      expect(map.size).toBe(1);
      expect(map.get(PREPROD_SUBJECT)).toBeTruthy();
      expect(map.get(FAKE_SUBJECT)).toBeUndefined();
    });
  });
});
