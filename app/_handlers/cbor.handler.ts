import { StatusCodes } from "http-status-codes";
import pallas, { napiParseDatumInfo, type CborResponse } from "napi-pallas";
import type { IAsset, IUtxo } from "../_interfaces";
import {
  POLICY_LENGTH,
  getApiKey,
  getTransactionURL,
  getUTxOsURL,
  isEmpty,
  type NETWORK,
} from "../_utils";
import { BlockfrostUTxOSchema } from "../_utils/schemas/blockfrostResponseSchema";

interface ICborHandler {
  network: NETWORK;
  cbor: string;
}

const inputsHandle = async ({
  inputs,
  network,
  apiKey,
}: {
  inputs: { txHash: string; index: string }[];
  network: NETWORK;
  apiKey: string;
}): Promise<IUtxo[]> => {
  const inputPromises = inputs.map(async (input) => {
    const blockfrostUtxo = await fetch(getUTxOsURL(network, input.txHash), {
      headers: { project_id: apiKey },
      method: "GET",
    }).then(async (res) => {
      if (res.status !== StatusCodes.OK) throw res;
      return await res.json();
    });
    const parsedUtxo = BlockfrostUTxOSchema.parse(blockfrostUtxo);
    const utxo = parsedUtxo.outputs.find(
      (utxo) => utxo.output_index === Number(input.index),
    );
    if (!utxo) throw Error("Input not found");
    return { hash: input.txHash, ...utxo };
  });
  const inputResponses = await Promise.all(inputPromises);
  return inputResponses.map((input) => {
    const datum = input.inline_datum
      ? {
          hash: napiParseDatumInfo(input.inline_datum)?.hash || "",
          bytes: napiParseDatumInfo(input.inline_datum)?.bytes || "",
          json: JSON.parse(
            napiParseDatumInfo(input.inline_datum)?.json || "null",
          ),
        }
      : undefined;
    return {
      txHash: input.hash,
      index: input.output_index,
      address: input.address,
      assets: input.amount.map(({ unit, quantity }) => ({
        assetName: unit == "lovelace" ? unit : unit.slice(POLICY_LENGTH),
        policyId: unit.slice(0, POLICY_LENGTH),
        amount: Number(quantity),
      })),
      datum,
      scriptRef: input.reference_script_hash || undefined,
    };
  });
};

export const cborHandler = async ({ cbor, network }: ICborHandler) => {
  try {
    const formData = new FormData();
    formData.append("raw", cbor);

    const res: CborResponse = pallas.cborParse(cbor);

    if (!isEmpty(res.error)) throw Error(res.error);

    const apiKey = getApiKey(network);

    const inputs = await inputsHandle({ inputs: res.inputs, network, apiKey });
    const referenceInputs = await inputsHandle({
      inputs: res.referenceInputs,
      network,
      apiKey,
    });

    const outputs: IUtxo[] = res.outputs.map((output) => {
      const datum = {
        hash: output.datum?.hash || "",
        bytes: output.datum?.bytes || "",
        json: JSON.parse(output.datum?.json || "null"),
      };
      return {
        ...output,
        index: Number(output.index),
        assets: output.assets.map((asset) => ({
          ...asset,
          amount: Number(asset.quantity),
        })),
        datum:
          isEmpty(datum.hash) && isEmpty(datum.bytes) && datum.json === null
            ? undefined
            : datum,
        scriptRef: output.scriptRef,
      };
    });

    const mints: IAsset[] = res.mints.map((mint) => ({
      ...mint,
      amount: Number(mint.quantity),
    }));

    const txInfo = await fetch(getTransactionURL(network, res.txHash), {
      headers: { project_id: apiKey },
      method: "GET",
    }).then(async (res) => {
      if (res.status !== StatusCodes.OK) throw res;
      return await res.json();
    });

    return Response.json({
      txHash: res.txHash,
      fee: res.fee,
      inputs,
      blockHash: txInfo.block,
      blockTxIndex: txInfo.index,
      blockHeight: txInfo.block_height,
      blockAbsoluteSlot: txInfo.slot,
      referenceInputs,
      scriptsSuccessful: res.scriptsSuccessful,
      outputs,
      mints,
      metadata: res.metadata,
      withdrawals: res.withdrawals,
      certificates: res.certificates,
      size: res.size,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: `CBOR Error: ${error}`,
      },
    );
  }
};
