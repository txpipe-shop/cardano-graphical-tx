import { BlockRes } from '@laceanatomy/provider-core';
import {
  Address,
  Hash,
  HexString,
  MetadatumMap,
  uint8ToAddr,
  uint8ToHash,
  uint8ToHexString,
  Unit,
  Value,
  type cardano,
  type Metadata,
  type Metadatum
} from '@laceanatomy/types';
import type { cardano as cardanoUtxoRpc } from '@utxorpc/spec';
import assert from 'assert';
import { Buffer } from 'buffer';

export function toBigInt(value: Uint8Array | bigint | undefined): bigint {
  if (value === undefined) return 0n;

  if (value instanceof Uint8Array) {
    if (value.length === 0) return 0n;
    return BigInt('0x' + Buffer.from(value).toString('hex'));
  }

  return BigInt(value);
}

export async function getBlockPreviousHash(nativeBytes: Uint8Array): Promise<Hash> {
  const cbor = await import('cbor2');
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const cborParsed = cbor.decode<any>(nativeBytes);

  // let's ignore the era of the block
  const blockCborDecoded = cborParsed[1];
  const encoded = cbor.encode(blockCborDecoded);
  if (typeof window !== 'undefined') {
    const { Block } = await import('@emurgo/cardano-serialization-lib-browser');
    const hash = Block.from_bytes(encoded).header().header_body().prev_hash()?.to_hex();
    assert(hash);

    return Hash(hash);
  } else {
    const { Block } = await import('@emurgo/cardano-serialization-lib-nodejs');
    const hash = Block.from_bytes(encoded).header().header_body().prev_hash()?.to_hex();
    assert(hash);

    return Hash(hash);
  }
}

export function u5cToCardanoBlock(block: cardanoUtxoRpc.Block): BlockRes {
  const fees = block.body!.tx.reduce((acc, tx) => acc + toBigInt(tx.fee?.bigInt.value), 0n);
  return {
    hash: uint8ToHash(block.header!.hash),
    height: toBigInt(block.header!.height),
    slot: toBigInt(block.header!.slot),
    txCount: BigInt(block.body!.tx.length),
    fees,
    time: Number(block.timestamp) * 1000,
    // TODO: get confirmations
    confirmations: 0n
  };
}

function getRefScript(script: cardanoUtxoRpc.Script): cardano.Script | undefined {
  const { script: s } = script;
  if (s.case && s.case !== 'native') {
    return {
      type: s.case as cardano.ScriptType,
      bytes: s.value ? HexString(Buffer.from(s.value).toString('hex')) : HexString('')
    };
  } else if (s.case === 'native' && s.value) {
    // TODO: figure out how to handle native scripts
    return { type: s.case as cardano.ScriptType, bytes: HexString('') };
  }
  return undefined;
}

export function outputsToValue(outputs: cardanoUtxoRpc.TxOutput[]): Value {
  const lovelaceUnit = Unit('lovelace');
  const result: Value = {};

  for (const output of outputs) {
    if (output.coin?.bigInt?.value !== undefined) {
      const lovelace = toBigInt(output.coin.bigInt.value);
      result[lovelaceUnit] = (result[lovelaceUnit] ?? 0n) + lovelace;
    }

    if (output.assets) {
      for (const multiasset of output.assets) {
        const policyId = Buffer.from(multiasset.policyId).toString('hex');

        for (const asset of multiasset.assets) {
          const assetName = Buffer.from(asset.name).toString('hex');
          const unit = Unit(`${policyId}${assetName}`);
          const quantity = toBigInt(asset.quantity.value?.bigInt.value);

          result[unit] = (result[unit] ?? 0n) + quantity;
        }
      }
    }
  }

  return result;
}

export function u5cToCardanoUtxo(
  hash: Hash,
  output: cardanoUtxoRpc.TxOutput | undefined,
  index: number
): cardano.UTxO {
  const value: Record<string, bigint> = {};

  if (output?.assets) {
    for (const multiAsset of output.assets) {
      const policyId = Buffer.from(multiAsset.policyId).toString('hex');

      for (const asset of multiAsset.assets) {
        const assetName = Buffer.from(asset.name).toString('hex');
        const key = `${policyId}${assetName}`;

        const quantityVal = asset.quantity.value?.bigInt?.value;
        value[key] = toBigInt(quantityVal);
      }
    }
  }

  return {
    address: output ? uint8ToAddr(output.address) : ('' as Address),
    coin: toBigInt(output?.coin?.bigInt.value),
    outRef: { hash: hash, index: BigInt(index) },
    value,
    datum: undefined,
    referenceScript: output?.script ? getRefScript(output.script) : undefined
  };
}

export function u5cMetadatumToCardanoMetadatum(m: cardanoUtxoRpc.Metadatum): Metadatum {
  const metadatum = m.metadatum;
  switch (metadatum.case) {
    case 'int': {
      return toBigInt(metadatum.value);
    }
    case 'bytes': {
      return uint8ToHexString(Buffer.from(metadatum.value));
    }
    case 'text': {
      return metadatum.value;
    }
    case 'array': {
      return metadatum.value.items.map(u5cMetadatumToCardanoMetadatum);
    }
    case 'map': {
      return new MetadatumMap(
        metadatum.value.pairs.map((pair) => [
          u5cMetadatumToCardanoMetadatum(pair.key!),
          u5cMetadatumToCardanoMetadatum(pair.value!)
        ])
      );
    }
    default:
      throw new Error('Invalid datum');
  }
}

export function u5cToCardanoMetadata(metadata: cardanoUtxoRpc.Metadata[]): Metadata {
  return metadata
    .map((x): [bigint, Metadatum] => {
      const label = toBigInt(x.label);
      const metadatum = x.value!;
      return [label, u5cMetadatumToCardanoMetadatum(metadatum)];
    })
    .reduce((map, [label, metadatum]) => {
      map.set(label, metadatum);
      return map;
    }, new Map<bigint, Metadatum>());
}

export function u5cToCardanoTx(
  tx: cardanoUtxoRpc.Tx,
  time: bigint,
  blockHash: Hash,
  blockHeight: bigint,
  indexInBlock: number
): cardano.Tx {
  const fee = toBigInt(tx.fee?.bigInt.value);
  const hash = uint8ToHash(tx.hash);
  const inputs = tx.inputs.map((x) =>
    u5cToCardanoUtxo(uint8ToHash(x.txHash), x.asOutput, x.outputIndex)
  );
  const outputs = tx.outputs.map((txOut, i) => u5cToCardanoUtxo(hash, txOut, i));

  const metadata = tx.auxiliary?.metadata ? u5cToCardanoMetadata(tx.auxiliary.metadata) : undefined;

  const mint: Record<string, bigint> = {};
  for (const ma of tx.mint) {
    const policy = Buffer.from(ma.policyId).toString('hex');
    for (const asset of ma.assets) {
      const hexName = Buffer.from(asset.name).toString('hex');
      mint[`${policy}${hexName}`] = toBigInt(asset.quantity.value?.bigInt.value);
    }
  }

  const referenceInputs = tx.referenceInputs.map((x, i) => u5cToCardanoUtxo(hash, x.asOutput!, i));
  const scripts = tx.witnesses?.script.map(({ script }) => {
    return {
      type: script.case as cardano.ScriptType,
      bytes:
        script.value && script.case !== 'native'
          ? HexString(Buffer.from(script.value).toString('hex'))
          : HexString('')
    };
  });

  return {
    fee,
    hash,
    inputs,
    metadata,
    mint,
    outputs,
    referenceInputs,
    createdAt: Number(time),
    witnesses: { scripts },
    block: { hash: blockHash, height: blockHeight, epochNo: 0n, slot: 0n },
    treasuryDonation: 0n,
    indexInBlock: BigInt(indexInBlock)
  };
}
