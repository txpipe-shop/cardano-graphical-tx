import { StatusCodes } from "http-status-codes";
import { parseAddress } from "napi-pallas";

export const addressHandler = async (raw: string) => {
  try {
    const res = parseAddress(raw);
    return Response.json({ ...res, raw });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        statusText: `Address Error: ${error}`,
      },
    );
  }
};
