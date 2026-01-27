import { type Asset, type Assets, CborResponse, type Utxo } from "@laceanatomy/napi-pallas";
import { ChainProvider } from "@laceanatomy/provider-core";
import {
  assetNameFromUnit,
  Cardano,
  type cardano,
  DatumType,
  type Hash,
  HexString,
  hexToAscii,
  hexToBech32,
  policyFromUnit,
  type Unit,
} from "@laceanatomy/types";
import { type ITransaction } from "~/app/_interfaces";
import { isHexa } from "~/app/_utils";

type ParseCbor = (cbor: string) => Promise<CborResponse>;

function providerToPreGraphicalUTxO(cUtxo: cardano.UTxO): Utxo {
  const datum = cUtxo.datum;
  const assets: Assets[] = [];
  for (const [unit, amount] of Object.entries(cUtxo.value)) {
    const policyId = policyFromUnit(unit as Unit);
    const assetName = assetNameFromUnit(unit as Unit);
    const asset: Asset = {
      assetName,
      amount: Number(amount),
      assetNameAscii: hexToAscii(assetName),
    };

    const ma = assets.find((x) => x.policyId === policyId);
    if (ma) {
      ma.assetsPolicy.push(asset);
    } else {
      assets.push({
        assetsPolicy: [asset],
        policyId,
      });
    }
  }

  return {
    address: isHexa(cUtxo.address)
      ? hexToBech32(HexString(cUtxo.address), "addr")
      : cUtxo.address,
    txHash: cUtxo.outRef.hash,
    assets,
    bytes: "",
    index: Number(cUtxo.outRef.index),
    lovelace: Number(cUtxo.coin),
    datum: datum
      ? datum.type === DatumType.HASH
        ? { hash: datum.datumHashHex, bytes: "", json: "" }
        : { bytes: datum.datumHex, json: "", hash: "" }
      : undefined,
    scriptRef: cUtxo.referenceScript?.bytes,
  };
}

export async function loadTxPageData(
  provider: ChainProvider<cardano.UTxO, cardano.Tx, Cardano>,
  hash: Hash,
  parseCbor: ParseCbor,
) {
  const cardanoTx = await provider.getTx({ hash });
  const cbor = await provider.getCBOR({ hash });
  const analyzedCbor = await parseCbor(cbor);
  const inputs: ITransaction["inputs"] = cardanoTx.inputs.map(
    providerToPreGraphicalUTxO,
  );
  const referenceInputs = cardanoTx.referenceInputs.map(
    providerToPreGraphicalUTxO,
  );

  const tx: ITransaction = {
    txHash: analyzedCbor.txHash,
    era: analyzedCbor.era,
    fee: analyzedCbor.fee || Number(cardanoTx.fee),
    inputs,
    mints: analyzedCbor.mints,
    outputs: analyzedCbor.outputs,
    referenceInputs,
    scriptsSuccessful: analyzedCbor.scriptsSuccessful,
    size: analyzedCbor.size,
    blockAbsoluteSlot: Number(cardanoTx.block.slot),
    blockHash: cardanoTx.block.hash,
    blockHeight: Number(cardanoTx.block.height),
    blockTxIndex: Number(cardanoTx.indexInBlock),
    certificates: analyzedCbor.certificates,
    collateral: analyzedCbor.collateral,
    metadata: analyzedCbor.metadata,
    ttl: analyzedCbor.ttl,
    validityStart: analyzedCbor.validityStart,
    withdrawals: analyzedCbor.withdrawals,
    witnesses: analyzedCbor.witnesses,
  };

  return { tx, cardanoTx, cbor };
}
