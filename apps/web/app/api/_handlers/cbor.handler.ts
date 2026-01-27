import {
  cborParse,
  parseDatumInfo,
  type Assets,
  type Input,
  type SafeCborResponse,
  type Utxo,
} from "@laceanatomy/napi-pallas";
import { StatusCodes } from "http-status-codes";
import {
  BlockfrostUTxOSchema,
  ERRORS,
  getApiKey,
  getAssetName,
  getTransactionURL,
  getUTxOsURL,
  isEmpty,
  POLICY_LENGTH, type Network,
} from "~/app/_utils";

interface ICborHandler {
  network: Network;
  cbor: string;
}

const inputsHandle = async ({
  inputs,
  network,
  apiKey,
}: {
  inputs: Input[];
  network: Network;
  apiKey: string;
}): Promise<Utxo[]> => {
  const inputPromises = inputs.map(async (input) => {
    try {
      const blockfrostUtxoRes = await fetch(
        getUTxOsURL(network, input.txHash),
        { headers: { project_id: apiKey }, method: "GET" },
      );
      if (blockfrostUtxoRes.status !== StatusCodes.OK) throw blockfrostUtxoRes;
      const blockfrostUtxo = await blockfrostUtxoRes.json();
      const parsedUtxo = BlockfrostUTxOSchema.parse(blockfrostUtxo);
      const utxo = parsedUtxo.outputs.find(
        (utxo) => utxo.output_index === Number(input.index),
      );
      if (!utxo) throw Error("Input not found");
      return { hash: input.txHash, ...utxo };
    } catch {
      return {
        hash: input.txHash,
        output_index: input.index,
        address: "",
        amount: [],
        data_hash: null,
        inline_datum: null,
        reference_script_hash: null,
        collateral: false,
      };
    }
  });
  const inputResponses = await Promise.all(inputPromises);
  return inputResponses.map((input) => {
    const datum = input.inline_datum
      ? {
        hash: parseDatumInfo(input.inline_datum)?.hash || "",
        bytes: parseDatumInfo(input.inline_datum)?.bytes || "",
        json: JSON.parse(parseDatumInfo(input.inline_datum)?.json || "null"),
      }
      : undefined;
    return {
      txHash: input.hash,
      index: input.output_index,
      bytes: "",
      address: input.address,
      lovelace:
        input.amount.length > 0
          ? Number(
            input.amount.find((asset) => asset.unit === "lovelace")!.quantity,
          )
          : 0,
      assets: input.amount.reduce((acc, { unit, quantity }) => {
        if (unit == "lovelace") return acc;
        const policyId = unit.slice(0, POLICY_LENGTH);
        const assetName = unit.slice(POLICY_LENGTH);
        const assetNameAscii = getAssetName(assetName);
        const amount = Number(quantity);
        const assetWithPolicyExisting = acc.find(
          (asset) => asset.policyId === policyId,
        );
        if (assetWithPolicyExisting)
          assetWithPolicyExisting.assetsPolicy.push({
            assetName,
            assetNameAscii,
            amount,
          });
        else
          acc.push({
            policyId,
            assetsPolicy: [{ assetName, assetNameAscii, amount }],
          });
        return acc;
      }, [] as Assets[]),
      datum,
      scriptRef: input.reference_script_hash || undefined,
    };
  });
};

export const cborHandler = async ({ cbor, network }: ICborHandler) => {
  try {
    const res: SafeCborResponse = cborParse(cbor);

    if (!isEmpty(res.error)) throw Error(res.error);

    const apiKey = getApiKey(network);

    const cborRes = res.cborRes!;

    const inputs = await inputsHandle({
      inputs: cborRes.inputs,
      network,
      apiKey,
    });
    const referenceInputs = await inputsHandle({
      inputs: cborRes.referenceInputs,
      network,
      apiKey,
    });

    let warning = "";
    if (inputs.filter((input) => isEmpty(input.address)).length > 0) {
      warning = ERRORS.inputs_not_found;
    }

    try {
      const txInfoRes = await fetch(
        getTransactionURL(network, cborRes.txHash),
        {
          headers: { project_id: apiKey },
          method: "GET",
        },
      );

      if (txInfoRes.status !== StatusCodes.OK)
        return Response.json({
          ...cborRes,
          inputs,
          referenceInputs,
          warning,
        });
      const txInfo = await txInfoRes.json();

      return Response.json({
        ...cborRes,
        inputs,
        referenceInputs,
        blockHash: txInfo.block,
        blockTxIndex: txInfo.index,
        blockHeight: txInfo.block_height,
        blockAbsoluteSlot: txInfo.slot,
        warning,
      });
    } catch (error) {
      if (error instanceof TypeError) {
        return Response.json({
          ...cborRes,
          inputs,
          referenceInputs,
          warning: ERRORS.internal_error,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      { error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: `${error}`,
      },
    );
  }
};
