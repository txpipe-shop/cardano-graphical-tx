import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { type NextRequest } from "next/server";
import { ZodError } from "zod";
import { getQuery, getTxFromHashSchema } from "~/app/_utils";
import { hashHandler } from "../_handlers";

export async function GET(req: NextRequest) {
  try {
    const { network, txId } = getTxFromHashSchema.parse(getQuery(req.url));
    return await hashHandler({ network, hash: txId });
  } catch (err: any) {
    if (err instanceof ZodError) {
      const errors = err.issues.map((issue: any) => issue.message).join(", ");
      return new Response(null, {
        status: StatusCodes.BAD_REQUEST,
        statusText: errors,
      });
    }

    return new Response(null, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
}
