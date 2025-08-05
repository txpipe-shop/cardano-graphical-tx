import type { CardanoTx, CardanoUTxO } from '@/types';
import {
  Address,
  DatumType,
  Hash,
  HexString,
  Unit,
  type Datum,
  type Value
} from '@/types/utxo-model';
import type { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { Address as BlazeAddr } from '@blaze-cardano/core';
import { addManyValues, diffValues } from '@/types/utils';

type BfTx = Awaited<ReturnType<BlockFrostAPI['txs']>>;
type BfTxUtxos = Awaited<ReturnType<BlockFrostAPI['txsUtxos']>>;
type BfValue = { unit: string; quantity: string }[];
type BfInputUtxo = BfTxUtxos['inputs'][0];
type BfOutputUtxo = BfTxUtxos['outputs'][0];

export function bfToCardanoTx(tx: BfTx, txUtxos: BfTxUtxos): CardanoTx {
  const inputs = txUtxos.inputs.map(bfInputToCardanoUtxo);
  const outputs = txUtxos.outputs.map((txOut) => bfOutputToCardanoUtxo(Hash(tx.hash), txOut));

  const input = addManyValues(inputs.map((x) => x.value));
  const output = addManyValues(outputs.map((x) => x.value));
  const mint = diffValues(output, input);

  const cardanoTx: CardanoTx = {
    fee: BigInt(tx.fees),
    hash: Hash(tx.hash),
    inputs,
    metadata: undefined,
    mint,
    outputs,
    // TODO: figure out how to complete reference inputs
    referenceInputs: [],
    treasury: undefined,
    treasuryDonation: undefined
  };

  return cardanoTx;
}

export function bfCoin(value: BfValue): bigint {
  return BigInt(value.find((x) => x.unit === 'lovelace')!.quantity);
}

export function bfValue(value: BfValue): Value {
  return value.reduce((acc, x) => {
    if (x.unit === 'lovelace') return acc;
    acc[Unit(x.unit)] = BigInt(x.quantity);
    return acc;
  }, {} as Value);
}

export function bfDatum(utxo: BfInputUtxo | BfOutputUtxo) {
  let datum: Datum | undefined = undefined;
  if (utxo.inline_datum) {
    datum = { type: DatumType.INLINE, datumHex: HexString(utxo.inline_datum) };
  } else if (utxo.data_hash) {
    datum = { type: DatumType.HASH, datumHashHex: Hash(utxo.data_hash) };
  }

  return datum;
}

export function bfInputToCardanoUtxo(utxo: BfInputUtxo): CardanoUTxO {
  const referenceScript = utxo.reference_script_hash
    ? HexString(utxo.reference_script_hash)
    : undefined;

  return {
    address: Address(BlazeAddr.fromBech32(utxo.address).toBytes()),
    coin: bfCoin(utxo.amount),
    outRef: { hash: Hash(utxo.tx_hash), index: BigInt(utxo.output_index) },
    value: bfValue(utxo.amount),
    datum: bfDatum(utxo),
    // TODO: is this ok? not sure at all
    referenceScript
  };
}

export function bfOutputToCardanoUtxo(hash: Hash, utxo: BfOutputUtxo): CardanoUTxO {
  const referenceScript = utxo.reference_script_hash
    ? HexString(utxo.reference_script_hash)
    : undefined;

  return {
    address: Address(BlazeAddr.fromBech32(utxo.address).toBytes()),
    coin: bfCoin(utxo.amount),
    outRef: { hash: hash, index: BigInt(utxo.output_index) },
    value: bfValue(utxo.amount),
    datum: bfDatum(utxo),
    // TODO: is this ok? not sure at all
    referenceScript
  };
}
