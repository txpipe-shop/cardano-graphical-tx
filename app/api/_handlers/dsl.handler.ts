import { StatusCodes } from "http-status-codes";
import { parseDsl, type SafeDslResponse } from "napi-pallas";

interface IDslHandler {
  dsl: string;
}

export const dslHandler = async ({ dsl }: IDslHandler) => {
  try {
    const res: SafeDslResponse = parseDsl(dsl);
    return Response.json(res);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: `DSL Error: ${error}`,
      },
    );
  }
};
