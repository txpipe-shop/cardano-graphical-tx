import type { BlockRes } from '@laceanatomy/provider-core';
import {
  Address,
  DatumType,
  Hash,
  HexString,
  Unit,
  type Value,
  type cardano
} from '@laceanatomy/types';
import type {
  AddressUtxoContentInner,
  BlockContent,
  TxContentOutputAmountInner
} from '@laceanatomy/blockfrost-sdk';

export function blockfrostAmountToValue(amounts: TxContentOutputAmountInner[]): Value {
  const result: Value = {};
  for (const { unit, quantity } of amounts) {
    result[Unit(unit)] = BigInt(quantity);
  }
  return result;
}

export function blockfrostBlockToBlockRes(block: BlockContent): BlockRes {
  return {
    hash: Hash(block.hash),
    height: BigInt(block.height ?? 0),
    slot: BigInt(block.slot ?? 0),
    txCount: BigInt(block.tx_count),
    fees: BigInt(block.fees ?? 0),
    time: block.time * 1000,
    confirmations: BigInt(block.confirmations),
    size: BigInt(block.size),
    epoch: block.epoch !== null ? BigInt(block.epoch) : undefined
  };
}

export function blockfrostUtxoToCardanoUtxo(utxo: AddressUtxoContentInner): cardano.UTxO {
  const lovelace = utxo.amount.find((a) => a.unit === 'lovelace');
  const coin = BigInt(lovelace?.quantity ?? '0');

  const value: Value = {};
  for (const { unit, quantity } of utxo.amount) {
    if (unit !== 'lovelace') {
      value[Unit(unit)] = BigInt(quantity);
    }
  }

  return {
    outRef: {
      hash: Hash(utxo.tx_hash),
      index: BigInt(utxo.output_index)
    },
    address: Address(utxo.address),
    coin,
    value,
    datum: utxo.inline_datum
      ? { type: DatumType.INLINE, datumHex: HexString(utxo.inline_datum) }
      : utxo.data_hash
        ? { type: DatumType.HASH, datumHashHex: Hash(utxo.data_hash) }
        : undefined,
    referenceScript: utxo.reference_script_hash
      ? { hash: HexString(utxo.reference_script_hash) }
      : undefined
  };
}
