import { type Network } from "@laceanatomy/types/cardano";
import { isAxiosError } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { BlockfrostResponseSchema } from "~/app/_utils";
import { getBlockfrostTransactionsApi } from "~/server/api/blockfrost";

interface IHashHandler {
  network: Network;
  hash: string;
}

export const hashHandler = async ({ network, hash }: IHashHandler) => {
  try {
    const { data } = await getBlockfrostTransactionsApi(network).txsHashCborGet(
      hash,
    );
    const parsedData = BlockfrostResponseSchema.parse(data);
    return Response.json(parsedData);
  } catch (err: unknown) {
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

    if (isAxiosError(err)) {
      if (err.response?.status === StatusCodes.NOT_FOUND) {
        return Response.json(
          {
            error:
              "Transaction not found. Check your hash or try using another network",
          },
          {
            status: err.response.status,
            statusText:
              "Transaction not found. Check your hash or try using another network",
          },
        );
      }
      if (err.response) {
        return Response.json(
          { error: err.response.statusText },
          {
            status: err.response.status,
            statusText: err.response.statusText,
          },
        );
      }
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
