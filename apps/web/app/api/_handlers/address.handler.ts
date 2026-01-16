import { StatusCodes } from "http-status-codes";
import {
  parseAddress,
  type SafeAddressResponse,
} from "@laceanatomy/napi-pallas";
import { isEmpty } from "~/app/_utils";

export const addressHandler = async (raw: string) => {
  try {
    const res: SafeAddressResponse = parseAddress(raw);
    if (res.error && !isEmpty(res.error)) throw new Error(res.error);
    return Response.json({ ...res, raw });
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
