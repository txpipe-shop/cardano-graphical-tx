import { isBase58 } from '../utils.js';
import { type Address, type Metadata } from '../utxo-model.js';

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

export function addressToBech32Prefix(addr: Address): string | null {
  if (isBase58(addr)) return null;

  const headerByte = parseInt(addr.slice(0, 2), 16);
  const addressType = headerByte >> 4;
  const network = headerByte & 0x0f;
  const netSuffix = network === 1 ? '' : '_test';

  if (addressType >= 0x00 && addressType <= 0x07) return `addr${netSuffix}`;
  if (addressType === 0x0e || addressType === 0x0f) return `stake${netSuffix}`;

  return null;
}

export function resolveShelleyTypeLabel(addressInfo: {
  paymentPart?: unknown;
  delegationPart?: { pointer?: unknown; hash?: unknown };
}): string {
  const payment = addressInfo.paymentPart;
  const delegation = addressInfo.delegationPart;

  if (delegation?.pointer) return 'Pointer address';
  if (delegation?.hash && payment) return 'Base address (payment & delegation)';
  if (payment && !delegation?.hash && !delegation?.pointer) return 'Base address (payment only)';

  return 'Shelley';
}
