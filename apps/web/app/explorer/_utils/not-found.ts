function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;

  const status = (error as { status?: unknown }).status;
  if (typeof status === "number") return status;

  const statusCode = (error as { statusCode?: unknown }).statusCode;
  if (typeof statusCode === "number") return statusCode;

  const responseStatus = (error as { response?: { status?: unknown } })
    .response?.status;
  if (typeof responseStatus === "number") return responseStatus;

  return getErrorStatus((error as { cause?: unknown }).cause);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "";
}

export function isExplorerNotFound(error: unknown): boolean {
  if (getErrorStatus(error) === 404) return true;

  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("not found") ||
    message.includes("transaction is not a cardano transaction") ||
    message.includes("block reference of transaction empty")
  );
}
