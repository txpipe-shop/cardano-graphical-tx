import { cborParse } from "@laceanatomy/napi-pallas";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getTxFromDevnetCBORSchema, isEmpty } from "~/app/_utils";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const formDataMainCbor = formData.get("tx");

    const { txCbor } = getTxFromDevnetCBORSchema.parse({
      txCbor: formDataMainCbor,
    });

    const txRes = cborParse(txCbor);
    if (!isEmpty(txRes.error) || !txRes.cborRes) throw Error(txRes.error);

    return Response.json({
      tx: txRes.cborRes
    });
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
