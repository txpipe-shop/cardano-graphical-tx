import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { getApiKey, getBlockfrostURL, type NETWORK } from "~/app/_utils";
import { BlockfrostResponseSchema } from "~/app/_utils/schemas";

interface IHashHandler {
  network: NETWORK;
  hash: string;
}

export const hashHandler = async ({ network, hash }: IHashHandler) => {
  try {
    const apiKey = getApiKey(network);
    const cborRes = await fetch(getBlockfrostURL(network, hash), {
      headers: { project_id: apiKey },
      method: "GET",
    });
    if (cborRes.status !== StatusCodes.OK) throw cborRes;
    const cbor = await cborRes.json();
    const parsedData = BlockfrostResponseSchema.parse(cbor);
    return Response.json(parsedData);
  } catch (err: any) {
    console.error(err);
    if (err instanceof ZodError) {
      return Response.json(
        {
          error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: Server respond with invalid data`,
        },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: Server respond with invalid data`,
        },
      );
    }

    if (err instanceof TypeError) {
      return Response.json({ cbor: "", warning: "Blockfrost Internal Error" });
    }

    if (err.status === StatusCodes.NOT_FOUND) {
      return Response.json(
        {
          error:
            "Transaction not found. Check your hash or try using another network",
        },
        {
          status: err.status,
          statusText:
            "Transaction not found. Check your hash or try using another network",
        },
      );
    } else if (err.status !== StatusCodes.OK) {
      return Response.json(
        { error: err.statusText },
        {
          status: err.status,
          statusText: err.statusText,
        },
      );
    }
    return Response.json(
      { error: ReasonPhrases.INTERNAL_SERVER_ERROR },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
      },
    );
  }
};
