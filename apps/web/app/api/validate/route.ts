import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { validateTxSchema } from "~/app/_utils";
import { ValidationSetupError } from "~/server/api/validation/errors";
import { validateCurrentTx } from "~/server/api/validation/validate-tx";

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = validateTxSchema.parse(body);
    return Response.json(await validateCurrentTx(input));
  } catch (err) {
    console.error("Validation error:", err);

    if (err instanceof ZodError) {
      return errorResponse(
        err.issues.map((i) => i.message).join(", "),
        StatusCodes.BAD_REQUEST,
      );
    }

    if (err instanceof ValidationSetupError) {
      return errorResponse(err.message, err.status);
    }

    return errorResponse(
      err instanceof Error ? err.message : ReasonPhrases.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
