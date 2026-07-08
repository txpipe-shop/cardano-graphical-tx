import { StatusCodes } from "http-status-codes";

export class ValidationSetupError extends Error {
  constructor(
    message: string,
    public readonly status = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.name = "ValidationSetupError";
  }
}

export function isUnauthenticatedError(err: unknown): boolean {
  const code = (err as { code?: unknown })?.code;
  return (
    code === 16 || code === "Unauthenticated" || code === "unauthenticated"
  );
}
