import { StatusCodes } from "http-status-codes";
import {
  cborParse,
  parseDatumInfo,
  type Assets,
  type CborResponse,
  type Input,
  type SafeCborResponse,
  type Utxo,
} from "napi-pallas";
import {
  ERRORS,
  getApiKey,
  getAssetName,
  getTransactionURL,
  getUTxOsURL,
  isEmpty,
  POLICY_LENGTH,
  type NETWORK,
} from "~/app/_utils";
import { BlockfrostUTxOSchema } from "~/app/_utils/schemas";

interface ICborHandler {
  network: NETWORK;
  cbor: string;
}

const parseAssets = (amount: { unit: string; quantity: string }[]) => {
  const assets = amount.reduce((acc, { unit, quantity }) => {
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
  }, [] as Assets[]);
  const lovelace =
    amount.length > 0
      ? Number(amount.find(({ unit }) => unit === "lovelace")!.quantity)
      : 0;
  return { assets, lovelace };
};

const inputsHandle = async ({
  inputs,
  network,
  apiKey,
}: {
  inputs: Input[];
  network: NETWORK;
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
      const datum = utxo.inline_datum
        ? {
            hash: parseDatumInfo(utxo.inline_datum)?.hash || "",
            bytes: parseDatumInfo(utxo.inline_datum)?.bytes || "",
            json: JSON.parse(parseDatumInfo(utxo.inline_datum)?.json || "null"),
          }
        : undefined;
      const { assets, lovelace } = parseAssets(utxo.amount);
      return {
        ...input,
        bytes: "",
        address: utxo.address,
        lovelace,
        assets,
        datum,
        scriptRef: utxo.reference_script_hash || undefined,
      };
    } catch {
      return { ...input, bytes: "", address: "", lovelace: 0, assets: [] };
    }
  });
  return Promise.all(inputPromises);
};

const getInputsOutputs = async (
  cborRes: CborResponse,
  network: NETWORK,
): Promise<{
  inputs: Utxo[];
  referenceInputs: Utxo[];
  outputs: (Utxo & { consumedBy?: string })[];
  warning: string;
}> => {
  let warning = "";
  const apiKey = getApiKey(network);
  try {
    const blockfrostUtxoRes = await fetch(
      getUTxOsURL(network, cborRes.txHash),
      { headers: { project_id: apiKey }, method: "GET" },
    );
    if (blockfrostUtxoRes.status !== StatusCodes.OK) throw blockfrostUtxoRes;
    const blockfrostUtxos = await blockfrostUtxoRes.json();
    const parsedUtxos = BlockfrostUTxOSchema.parse(blockfrostUtxos);
    const inputs = parsedUtxos.inputs.map((input) => ({
      txHash: input.tx_hash,
      index: input.output_index,
      address: input.address,
      bytes: "",
      lovelace: parseAssets(input.amount).lovelace,
      assets: parseAssets(input.amount).assets,
      datum: input.inline_datum
        ? {
            hash: parseDatumInfo(input.inline_datum)?.hash || "",
            bytes: parseDatumInfo(input.inline_datum)?.bytes || "",
            json: JSON.parse(
              parseDatumInfo(input.inline_datum)?.json || "null",
            ),
          }
        : undefined,
      scriptRef: input.reference_script_hash || undefined,
      reference: input.reference,
    }));
    const outputs = parsedUtxos.outputs.map((output) => ({
      txHash: cborRes.txHash,
      index: output.output_index,
      address: output.address,
      bytes: "",
      lovelace: parseAssets(output.amount).lovelace,
      assets: parseAssets(output.amount).assets,
      scriptRef: output.reference_script_hash || undefined,
      consumedBy: output.consumed_by_tx || undefined,
    }));
    return {
      inputs: inputs
        .filter((input) => !input.reference)
        .map(({ reference: _reference, ...rest }) => rest),
      referenceInputs: inputs
        .filter((input) => input.reference)
        .map(({ reference: _reference, ...rest }) => rest),
      outputs,
      warning: ERRORS.inputs_not_found,
    };
  } catch {
    const inputs = await inputsHandle({
      inputs: cborRes.inputs,
      network,
      apiKey,
    });
    if (inputs.filter((input) => isEmpty(input.address)).length > 0) {
      warning = ERRORS.inputs_not_found;
    }
    const referenceInputs = await inputsHandle({
      inputs: cborRes.referenceInputs,
      network,
      apiKey,
    });
    return { inputs, referenceInputs, outputs: cborRes.outputs, warning };
  }
};

export const cborHandler = async ({ cbor, network }: ICborHandler) => {
  try {
    const res: SafeCborResponse = cborParse(cbor);

    if (!isEmpty(res.error)) throw Error(res.error);

    const apiKey = getApiKey(network);

    const cborRes = res.cborRes!;

    const { inputs, referenceInputs, outputs, warning } =
      await getInputsOutputs(cborRes, network);

    try {
      const txInfoRes = await fetch(
        getTransactionURL(network, cborRes.txHash),
        { headers: { project_id: apiKey }, method: "GET" },
      );

      if (txInfoRes.status !== StatusCodes.OK)
        return Response.json({
          ...cborRes,
          inputs,
          referenceInputs,
          outputs,
          warning,
        });
      const txInfo = await txInfoRes.json();

      return Response.json({
        ...cborRes,
        inputs,
        referenceInputs,
        outputs,
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
