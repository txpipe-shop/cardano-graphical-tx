import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { cborHandler } from "~/app/_handlers";
import { getQuery, getTxFromCBORSchema } from "~/app/_utils";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const formDataCbor = formData.get("cbor");

    const { network, cbor } = getTxFromCBORSchema.parse({
      ...getQuery(req.url),
      cbor: formDataCbor,
    });
    return await cborHandler({ network, cbor });
  } catch (err: any) {
    console.error(err);
    if (err.issues) {
      const errors = err.issues.map((issue: any) => issue.message);
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
