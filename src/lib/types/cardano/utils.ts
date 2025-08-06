import { Address, HexString, type Metadata } from '../utxo-model';
import { bech32 } from 'bech32';
import { Buffer } from 'buffer';

export function tryToParseCip20Metadata(metadata?: Metadata): string[] | undefined {
  const maybeMsg = metadata?.get(674n);
  if (maybeMsg instanceof Map) {
    const maybeMsgList = maybeMsg.get('msg');
    if (maybeMsgList instanceof Array) {
      const msgs = maybeMsgList.filter((x) => typeof x === 'string');
      return msgs;
    }
  }
}

export function bech32ToHex(bech32Address: string): Address {
  const { words } = bech32.decode(bech32Address);
  const bytes = bech32.fromWords(words);
  return Address(Buffer.from(bytes).toString('hex'));
}

export function hexToBech32(hex: HexString, prefix: string): string {
  const bytes = Buffer.from(hex, 'hex');
  const words = bech32.toWords(bytes);
  return bech32.encode(prefix, words);
}
