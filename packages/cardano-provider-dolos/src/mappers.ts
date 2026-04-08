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
  TxContentOutputAmountInner,
  TxContentUtxoInputsInner,
  TxContentUtxoOutputsInner
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

function amountToValueAndCoin(amounts: TxContentOutputAmountInner[]): {
  coin: bigint;
  value: Value;
} {
  const coin = BigInt(amounts.find((a) => a.unit === 'lovelace')?.quantity ?? '0');
  const value: Value = {};
  for (const { unit, quantity } of amounts) {
    if (unit !== 'lovelace') value[Unit(unit)] = BigInt(quantity);
  }
  return { coin, value };
}

export function blockfrostTxInputToCardanoUtxo(input: TxContentUtxoInputsInner): cardano.UTxO {
  const { coin, value } = amountToValueAndCoin(input.amount);
  return {
    outRef: { hash: Hash(input.tx_hash), index: BigInt(input.output_index) },
    address: Address(input.address),
    coin,
    value,
    datum: input.inline_datum
      ? { type: DatumType.INLINE, datumHex: HexString(input.inline_datum) }
      : input.data_hash
        ? { type: DatumType.HASH, datumHashHex: Hash(input.data_hash) }
        : undefined,
    referenceScript: input.reference_script_hash
      ? { hash: HexString(input.reference_script_hash) }
      : undefined
  };
}

export function blockfrostTxOutputToCardanoUtxo(
  txHash: string,
  output: TxContentUtxoOutputsInner
): cardano.UTxO {
  const { coin, value } = amountToValueAndCoin(output.amount);
  return {
    outRef: { hash: Hash(txHash), index: BigInt(output.output_index) },
    address: Address(output.address),
    coin,
    value,
    datum: output.inline_datum
      ? { type: DatumType.INLINE, datumHex: HexString(output.inline_datum) }
      : output.data_hash
        ? { type: DatumType.HASH, datumHashHex: Hash(output.data_hash) }
        : undefined,
    referenceScript: output.reference_script_hash
      ? { hash: HexString(output.reference_script_hash) }
      : undefined
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
