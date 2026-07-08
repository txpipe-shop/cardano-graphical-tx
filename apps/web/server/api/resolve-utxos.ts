import { cborParse, type ValidationInput } from "@laceanatomy/napi-pallas";
import type { UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";
import {
  ValidationSetupError,
  isUnauthenticatedError,
} from "./validation/errors";

export type ResolvedInput = { txHash: string; index: number };
export type ResolvedInputError = {
  txHash: string;
  index: number;
  reason: string;
};

export type ResolveInputsRes = {
  resolved: ValidationInput[];
  errors: ResolvedInputError[];
};

const uint8ToHex = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString("hex");

function isNotFoundError(err: unknown): boolean {
  const error = err as {
    code?: unknown;
    rawMessage?: unknown;
    message?: unknown;
  };
  return (
    error.code === 5 ||
    error.code === "NotFound" ||
    error.code === "not_found" ||
    String(error.rawMessage ?? error.message ?? "")
      .toLowerCase()
      .includes("not found")
  );
}

export async function resolveInputs(
  inputs: ResolvedInput[],
  client: UtxoRpcClient,
): Promise<ResolveInputsRes> {
  const inputsByTx = new Map<string, ResolvedInput[]>();
  for (const input of inputs) {
    const list = inputsByTx.get(input.txHash) ?? [];
    list.push(input);
    inputsByTx.set(input.txHash, list);
  }

  const outputsByTx = new Map<string, { bytes: string }[] | null>();

  await Promise.all(
    Array.from(inputsByTx.keys()).map(async (txHash) => {
      try {
        const response = await client.query.readTx({
          hash: new Uint8Array(Buffer.from(txHash, "hex")),
        });

        if (!response.tx) {
          outputsByTx.set(txHash, null);
          return;
        }

        if (response.tx.chain.case !== "cardano") {
          throw new ValidationSetupError(
            `UTxORPC returned a non-Cardano transaction for ${txHash}`,
          );
        }

        const parsed = cborParse(uint8ToHex(response.tx.nativeBytes));
        if (parsed.error || !parsed.cborRes) {
          throw new ValidationSetupError(
            `Failed to parse UTxORPC transaction ${txHash}: ${
              parsed.error || "missing parsed CBOR"
            }`,
          );
        }

        outputsByTx.set(
          txHash,
          parsed.cborRes.outputs.map((output) => ({ bytes: output.bytes })),
        );
      } catch (err) {
        if (err instanceof ValidationSetupError) {
          throw err;
        }
        if (isUnauthenticatedError(err)) {
          throw new ValidationSetupError(
            "UTxORPC request was unauthenticated. Check that the correct *_DOLOS_UTXORPC_API_KEY is configured for the selected network.",
          );
        }
        if (isNotFoundError(err)) {
          outputsByTx.set(txHash, null);
          return;
        }
        throw new ValidationSetupError(
          `Failed to resolve UTxORPC transaction ${txHash}: ${
            err instanceof Error ? err.message : "transport error"
          }`,
        );
      }
    }),
  );

  const resolved: ValidationInput[] = [];
  const errors: ResolvedInputError[] = [];

  for (const input of inputs) {
    const outputs = outputsByTx.get(input.txHash);
    const output = outputs?.[input.index];
    if (!output) {
      errors.push({
        txHash: input.txHash,
        index: input.index,
        reason: outputs === null ? "transaction not found" : "output not found",
      });
      continue;
    }
    resolved.push({
      txHash: input.txHash,
      index: input.index,
      bytes: output.bytes,
    });
  }

  return { resolved, errors };
}
