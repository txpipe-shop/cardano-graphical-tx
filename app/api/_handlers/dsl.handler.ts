import { StatusCodes } from "http-status-codes";
import { parseDsl, type SafeDslResponse } from "napi-pallas";
import { isEmpty } from "~/app/_utils";

interface IDslHandler {
  dsl: string;
}

export const dslHandler = async ({ dsl }: IDslHandler) => {
  try {
    const res: SafeDslResponse = parseDsl(dsl);
    if (!isEmpty(res.error)) throw new Error(res.error);
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
