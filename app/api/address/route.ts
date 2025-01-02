import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getAddressFromScema, getQuery } from "~/app/_utils";
import { addressHandler } from "~/app/api/_handlers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const formDataAddr = formData.get("raw");
    const { raw } = getAddressFromScema.parse({
      ...getQuery(req.url),
      raw: formDataAddr,
    });
    return await addressHandler(raw);
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
