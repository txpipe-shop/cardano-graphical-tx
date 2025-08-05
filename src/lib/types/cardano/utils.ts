import type { Metadata } from '../utxo-model';

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
