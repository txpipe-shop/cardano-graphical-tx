import { type cardano, uint8ToAddr, uint8ToHash, uint8ToHexString } from '@alexandria/types';
import {
  Address,
  Hash,
  HexString,
  MetadatumMap,
  type Metadata,
  type Metadatum
} from '@alexandria/types';
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
  console.log('About to decode');
  const cborParsed = cbor.decode<any>(nativeBytes);
  console.log('Finished decoding');
  console.log(Buffer.from(nativeBytes).toString('hex'));

  // let's ignore the era of the block
  const blockCborDecoded = cborParsed[1];
  console.log('About to encode');
  const encoded = cbor.encode(blockCborDecoded);
  console.log('Decoded successfully');
  if (typeof window !== 'undefined') {
    console.log('Running in browser');
    const { Block } = await import('@emurgo/cardano-serialization-lib-browser');
    const hash = Block.from_bytes(encoded).header().header_body().prev_hash()?.to_hex();
    assert(hash);
    return Hash(hash);
  } else {
    console.log('Running in nodejs');
    const { Block } = await import('@emurgo/cardano-serialization-lib-nodejs');
    const hash = Block.from_bytes(encoded).header().header_body().prev_hash()?.to_hex();
    assert(hash);
    return Hash(hash);
  }
}

export function u5cToCardanoBlock(block: cardanoUtxoRpc.Block): cardano.Block {
  return {
    epochNo: 0n,
    header: {
      blockNumber: toBigInt(block.header!.height),
      chainPoint: {
        hash: uint8ToHash(block.header!.hash),
        slot: toBigInt(block.header!.slot)
      },
      previousHash: undefined
    },
    txs: block.body!.tx.map((tx) =>
      u5cToCardanoTx(
        tx,
        toBigInt(block.timestamp),
        block.header?.hash ? uint8ToHash(block.header?.hash) : undefined,
        block.header?.height ? toBigInt(block.header?.height) : undefined
      )
    )
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
  blockHash: Hash | undefined,
  blockHeight: bigint | undefined
): cardano.Tx {
  const fee = toBigInt(tx.fee?.bigInt.value);
  const hash = uint8ToHash(tx.hash);
  const inputs = tx.inputs.map((x) => u5cToCardanoUtxo(hash, x.asOutput, x.outputIndex));
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
    block:
      blockHash && blockHeight ? { hash: blockHash, height: blockHeight, epochNo: 0n } : undefined,
    treasuryDonation: 0n,
    // TODO: fetch this information here
    indexInBlock: 0n
  };
}
