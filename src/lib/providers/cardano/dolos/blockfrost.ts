import {
  type TxContent as BfTx,
  type TxContentUtxo as BfTxUtxos,
  type TxContentRedeemersInner as BfTxRedeemer
} from '$lib/sdk/blockfrost';
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

import { bech32ToHex } from '@/types/cardano/utils';
import { addManyValues, diffValues } from '@/types/utils';

type BfValue = { unit: string; quantity: string }[];
type BfInputUtxo = BfTxUtxos['inputs'][0];
type BfOutputUtxo = BfTxUtxos['outputs'][0];

export function bfToCardanoTx(tx: BfTx, txUtxos: BfTxUtxos, rdmrs: BfTxRedeemer[]): CardanoTx {
  const inputs = txUtxos.inputs
    .filter((i) => !(i.collateral || i.reference))
    .map(bfInputToCardanoUtxo);
  const refInputs = txUtxos.inputs.filter((i) => i.reference).map(bfInputToCardanoUtxo);
  const outputs = txUtxos.outputs
    .filter((o) => !o.collateral)
    .map((txOut) => bfOutputToCardanoUtxo(Hash(tx.hash), txOut));

  const input = addManyValues(inputs.map((x) => x.value));
  const output = addManyValues(outputs.map((x) => x.value));
  const mint = diffValues(output, input);

  const redeemers = rdmrs.map((r) => {
    return {
      index: r.tx_index,
      purpose: r.purpose,
      scriptHash: HexString(r.script_hash),
      redeemerDataHash: HexString(r.redeemer_data_hash),
      unitMem: BigInt(r.unit_mem),
      unitSteps: BigInt(r.unit_steps),
      fee: BigInt(r.fee)
    };
  });

  const cardanoTx: CardanoTx = {
    fee: BigInt(tx.fees),
    hash: Hash(tx.hash),
    createdAt: tx.block_time ?? undefined,
    inputs,
    metadata: undefined,
    mint,
    outputs,
    referenceInputs: refInputs,
    witnesses: { redeemers },
    block: { hash: Hash(tx.block), height: BigInt(tx.block_height) },
    validityInterval: {
      invalidBefore: tx.invalid_before ? BigInt(tx.invalid_before) : undefined,
      invalidHereafter: tx.invalid_hereafter ? BigInt(tx.invalid_hereafter) : undefined
    },
    // TODO: figure out how to complete these fields
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
    if (x.unit !== 'lovelace') acc[Unit(x.unit)] = BigInt(x.quantity);
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
    ? { hash: HexString(utxo.reference_script_hash) }
    : undefined;

  return {
    address: utxo.address ? bech32ToHex(utxo.address) : ('' as Address),
    coin: utxo.amount.length ? bfCoin(utxo.amount) : 0n,
    outRef: { hash: Hash(utxo.tx_hash), index: BigInt(utxo.output_index) },
    value: utxo.amount.length ? bfValue(utxo.amount) : {},
    datum: bfDatum(utxo),
    // TODO: is this ok? not sure at all
    referenceScript
  };
}

export function bfOutputToCardanoUtxo(hash: Hash, utxo: BfOutputUtxo): CardanoUTxO {
  const referenceScript = utxo.reference_script_hash
    ? { hash: HexString(utxo.reference_script_hash) }
    : undefined;

  return {
    address: bech32ToHex(utxo.address),
    coin: bfCoin(utxo.amount),
    outRef: { hash: hash, index: BigInt(utxo.output_index) },
    value: bfValue(utxo.amount),
    datum: bfDatum(utxo),
    // TODO: is this ok? not sure at all
    referenceScript
  };
}
