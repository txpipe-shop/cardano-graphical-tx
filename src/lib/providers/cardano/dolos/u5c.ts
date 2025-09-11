import type { CardanoBlock, CardanoTx } from '@/types';
import type { UTxO } from '@/types/cardano/cardano';
import {
  addManyValues,
  diffValues,
  uint8ToAddr,
  uint8ToHash,
  uint8ToHexString
} from '@/types/utils';
import { Hash, MetadatumMap, type Metadata, type Metadatum } from '@/types/utxo-model';
import type { cardano } from '@utxorpc/spec';
import { Buffer } from 'buffer';

export function u5cToCardanoBlock(block: cardano.Block): CardanoBlock {
  return {
    header: {
      blockNumber: block.header!.height,
      chainPoint: {
        hash: uint8ToHash(block.header!.hash),
        slot: block.header!.slot
      },
      previousHash: undefined
    },
    txs: block.body!.tx.map((tx) => u5cToCardanoTx(tx, block.timestamp))
  };
}

export function u5cToCardanoUtxo(hash: Hash, output: cardano.TxOutput, index: number): UTxO {
  return {
    address: uint8ToAddr(output.address),
    coin: output.coin,
    outRef: { hash: hash, index: BigInt(index) },
    value: output.assets.reduce(
      (accumulator, currentItem) => {
        // Para cada `currentItem`, recorre sus assets y los agrega al acumulador.
        currentItem.assets.forEach((asset) => {
          const key = `${Buffer.from(currentItem.policyId).toString('hex')}${Buffer.from(asset.name).toString('hex')}`;
          accumulator[key] = asset.outputCoin;
        });
        return accumulator;
      },
      {} as Record<string, bigint>
    ),
    datum: undefined,
    referenceScript: undefined
  };
}

export function u5cMetadatumToCardanoMetadatum(m: cardano.Metadatum): Metadatum {
  const metadatum = m.metadatum;
  switch (metadatum.case) {
    case 'int': {
      return metadatum.value;
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

export function u5cToCardanoMetadata(metadata: cardano.Metadata[]): Metadata {
  return metadata
    .map((x): [bigint, Metadatum] => {
      const label = x.label;
      const metadatum = x.value!;
      return [label, u5cMetadatumToCardanoMetadatum(metadatum)];
    })
    .reduce((map, [label, metadatum]) => {
      map.set(label, metadatum);
      return map;
    }, new Map<bigint, Metadatum>());
}

export function u5cToCardanoTx(tx: cardano.Tx, time: bigint): CardanoTx {
  const fee = tx.fee;
  const hash = uint8ToHash(tx.hash);
  const inputs = tx.inputs.map((x) => u5cToCardanoUtxo(hash, x.asOutput!, x.outputIndex));
  const outputs = tx.outputs.map((txOut, i) => u5cToCardanoUtxo(hash, txOut, i));

  const metadata = tx.auxiliary?.metadata ? u5cToCardanoMetadata(tx.auxiliary.metadata) : undefined;

  const input = addManyValues(inputs.map((x) => x.value));
  const output = addManyValues(outputs.map((x) => x.value));
  const mint = diffValues(output, input);

  const referenceInputs = tx.referenceInputs.map((x, i) => u5cToCardanoUtxo(hash, x.asOutput!, i));

  return {
    fee,
    hash,
    inputs,
    metadata,
    mint,
    outputs,
    referenceInputs,
    createdAt: Number(time),
    // TODO: complete this on utxorpc
    treasury: 0n,
    treasuryDonation: 0n
  };
}
