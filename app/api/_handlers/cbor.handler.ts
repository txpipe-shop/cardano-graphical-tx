import { StatusCodes } from "http-status-codes";
import pallas, { napiParseDatumInfo, type CborResponse } from "napi-pallas";
import type { IAssets, IUtxo } from "~/app/_interfaces";
import {
  POLICY_LENGTH,
  getApiKey,
  getAssetName,
  getTransactionURL,
  getUTxOsURL,
  isEmpty,
  type NETWORK,
} from "~/app/_utils";
import { BlockfrostUTxOSchema } from "~/app/_utils/schemas";

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
      // TODO: Look for bytes
      bytes: "",
      address: input.address,
      lovelace: Number(
        input.amount.find((asset) => asset.unit === "lovelace")!.quantity,
      ),
      assets: input.amount.reduce((acc, { unit, quantity }) => {
        if (unit == "lovelace") return acc;
        const policyId = unit.slice(0, POLICY_LENGTH);
        const assetName = unit.slice(POLICY_LENGTH);
        const assetNameAscii = getAssetName(assetName);
        const coint = Number(quantity);
        const assetWithPolicyExisting = acc.find(
          (asset) => asset.policyId === policyId,
        );
        if (assetWithPolicyExisting) {
          assetWithPolicyExisting.assetsPolicy.push({
            assetName,
            assetNameAscii,
            coint,
          });
        } else {
          acc.push({
            policyId,
            assetsPolicy: [{ assetName, assetNameAscii, coint }],
          });
        }
        return acc;
      }, [] as IAssets[]),
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

    const txInfo = await fetch(getTransactionURL(network, res.txHash), {
      headers: { project_id: apiKey },
      method: "GET",
    }).then(async (res) => {
      if (res.status !== StatusCodes.OK) throw res;
      return await res.json();
    });

    return Response.json({
      ...res,
      inputs,
      referenceInputs,
      blockHash: txInfo.block,
      blockTxIndex: txInfo.index,
      blockHeight: txInfo.block_height,
      blockAbsoluteSlot: txInfo.slot,
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
