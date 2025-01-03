import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getDSLFromSchema, getQuery } from "~/app/_utils";
import { dslHandler } from "~/app/api/_handlers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const formDataDSL = formData.get("dsl");
    const { dsl } = getDSLFromSchema.parse({
      ...getQuery(req.url),
      dsl: formDataDSL,
    });
    return await dslHandler({ dsl });
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
