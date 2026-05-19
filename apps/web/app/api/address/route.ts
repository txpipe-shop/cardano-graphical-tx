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
  } catch (err: unknown) {
    console.error(err);
    const zodErr = err as { issues?: Array<{ message: string }> };
    if (zodErr.issues) {
      const errors = zodErr.issues.map((issue) => issue.message);
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
