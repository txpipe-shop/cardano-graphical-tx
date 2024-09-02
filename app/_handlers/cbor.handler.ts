import { StatusCodes } from "http-status-codes";
import pallas, { type CborResponse } from "napi-pallas";
import type { ICborAsset, IUtxo } from "../_interfaces";
import { type NETWORK, isEmpty } from "../_utils";

interface ICborHandler {
  network: NETWORK;
  cbor: string;
}
export const cborHandler = async ({ cbor }: ICborHandler) => {
  try {
    const formData = new FormData();
    formData.append("raw", cbor);

    const res: CborResponse = pallas.cborParse(cbor);

    if (!isEmpty(res.error)) throw Error(res.error);

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
      };
    });

    const mints: ICborAsset[] = res.mints.map((mint) => ({
      ...mint,
      amount: Number(mint.quantity),
    }));

    return Response.json({
      txHash: res.txHash,
      fee: res.fee,
      inputs: res.inputs,
      referenceInputs: res.referenceInputs,
      scriptsSuccessful: res.scriptsSuccessful,
      outputs,
      mints,
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
