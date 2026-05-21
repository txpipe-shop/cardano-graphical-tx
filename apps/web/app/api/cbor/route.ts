import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getQuery, getTxFromCBORSchema } from "~/app/_utils";
import { cborHandler } from "~/app/api/_handlers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const formDataCbor = formData.get("cbor");

    const { network, cbor } = getTxFromCBORSchema.parse({
      ...getQuery(req.url),
      cbor: formDataCbor,
    });
    return await cborHandler({ network, cbor });
  } catch (err: unknown) {
    console.error(err);
    const zodErr = err as { issues?: Array<{ message: string }> };
    if (zodErr.issues) {
      const errors = zodErr.issues.map((issue) => issue.message).join(", ");
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
