import { StatusCodes } from "http-status-codes";
import pallas, { CborResponse } from "napi-pallas";
import { ICborAsset, ICborUtxo } from "../_interfaces";
import { NETWORK, isEmpty } from "../_utils";

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

    const outputs: ICborUtxo[] = res.outputs.map((output) => {
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
      outputs,
      mints,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: `CBOR Error: ${error}`,
      },
    );
  }
};
