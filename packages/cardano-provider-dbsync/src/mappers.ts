import type { Tx } from '@alexandria/types';
import { Address, cardano, DatumType, Hash, HexString, Unit } from '@alexandria/types';
import * as QueryTypes from './types/queries';

/**
 * Map a transaction row from db-sync to CardanoTx format.
 */
export function mapTx(tx: QueryTypes.Tx): cardano.Tx {
  const mapAssets = (assets: Record<string, string>) => {
    const map: Record<Unit, bigint> = {};
    for (const [unit, quantity] of Object.entries(assets)) {
      map[Unit(unit)] = BigInt(quantity);
    }
    return map;
  };

  const mapUtxo = (input: {
    address: string;
    coin: string;
    outRef: { hash: string; index: number };
    value: Record<string, string>;
    consumedBy?: string | null;
    datum?: { type: 'inline' | 'hash'; datumHex?: string; datumHash?: string };
  }): cardano.UTxO => {
    let datum: cardano.UTxO['datum'];
    if (input.datum) {
      if (input.datum.type === 'inline' && input.datum.datumHex) {
        datum = {
          type: DatumType.INLINE,
          datumHex: HexString(input.datum.datumHex)
        };
      } else if (input.datum.type === 'hash' && input.datum.datumHash) {
        datum = {
          type: DatumType.HASH,
          datumHashHex: Hash(input.datum.datumHash)
        };
      }
    }

    return {
      address: Address(cardano.bech32ToHex(input.address)),
      coin: BigInt(input.coin),
      outRef: {
        hash: Hash(input.outRef.hash),
        index: BigInt(input.outRef.index)
      },
      value: mapAssets(input.value),
      // consumedBy is required by type but might be missing for unspent outputs.
      // We cast to any to allow undefined if the type forces string but logically it should be optional.
      consumedBy: (input.consumedBy ? Hash(input.consumedBy) : undefined) as any,
      datum
    };
  };

  return {
    hash: Hash(tx.hash),
    fee: BigInt(tx.fee),
    block: {
      hash: Hash(tx.block.hash),
      epochNo: BigInt(tx.block.epochNo),
      height: BigInt(tx.block.height)
    },
    createdAt: tx.createdAt,
    inputs: tx.inputs.map(mapUtxo),
    outputs: tx.outputs.map(mapUtxo),
    referenceInputs: tx.referenceInputs.map(mapUtxo),
    mint: mapAssets(tx.mint),
    metadata: new Map(Object.entries(tx.metadata).map(([k, v]) => [BigInt(k), HexString(v)])),
    treasuryDonation: tx.treasuryDonation ? BigInt(tx.treasuryDonation) : 0n,
    validityInterval: {
      invalidBefore: tx.validityInterval.invalidBefore
        ? BigInt(tx.validityInterval.invalidBefore)
        : undefined,
      invalidHereafter: tx.validityInterval.invalidHereafter
        ? BigInt(tx.validityInterval.invalidHereafter)
        : undefined
    },
    witnesses: {
      scripts: tx.witnesses.scripts.map((s) => ({
        hash: HexString(s.hash),
        type: s.type === 'timelock' ? cardano.ScriptType.Native : cardano.ScriptType.PlutusV1, // Defaulting to V1 if not specified, DB sync usually distinguishes via separate field or encoding
        bytes: HexString(s.bytes)
      })),
      redeemers: tx.witnesses.redeemers.map((r) => ({
        purpose: mapRedeemerPurpose(r.purpose),
        index: Number(r.index), // fixed: expect number
        redeemerDataHash: HexString(r.redeemerDataHash),
        scriptHash: HexString(r.scriptHash),
        unitMem: BigInt(r.unitMem),
        unitSteps: BigInt(r.unitSteps),
        fee: r.fee ? BigInt(r.fee) : 0n
      }))
    }
  };
}

function mapRedeemerPurpose(purpose: string): cardano.RdmrPurpose {
  switch (purpose) {
    case 'spend':
      return cardano.RdmrPurpose.Spend;
    case 'mint':
      return cardano.RdmrPurpose.Mint;
    case 'cert':
      return cardano.RdmrPurpose.Cert;
    case 'reward':
      return cardano.RdmrPurpose.Reward;
    default:
      return cardano.RdmrPurpose.Spend;
  }
}
