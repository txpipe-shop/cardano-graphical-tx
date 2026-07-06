import { cborParse, type ValidationInput } from "@laceanatomy/napi-pallas";
import type { UtxoRpcClient } from "@laceanatomy/utxorpc-sdk";

export type ResolvedInput = { txHash: string; index: number };
export type ResolvedInputError = { txHash: string; index: number; reason: string };

export type ResolveInputsRes = {
  resolved: ValidationInput[];
  errors: ResolvedInputError[];
};

const uint8ToHex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

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

  const outputsByTx = new Map<string, { bytes: string }[]>();

  await Promise.all(
    Array.from(inputsByTx.keys()).map(async (txHash) => {
      try {
        const response = await client.query.readTx({
          hash: new Uint8Array(Buffer.from(txHash, "hex")),
        });

        if (!response.tx || response.tx.chain.case !== "cardano") {
          outputsByTx.set(txHash, []);
          return;
        }

        const parsed = cborParse(uint8ToHex(response.tx.nativeBytes));
        if (parsed.error || !parsed.cborRes) {
          outputsByTx.set(txHash, []);
          return;
        }

        outputsByTx.set(
          txHash,
          parsed.cborRes.outputs.map((output) => ({ bytes: output.bytes })),
        );
      } catch (err) {
        const connectErr = err as { code?: unknown };
        if (connectErr.code === 16) {
          throw new Error(
            "UTxORPC request was unauthenticated. Check that the correct *_DOLOS_UTXORPC_API_KEY is configured for the selected network.",
          );
        }
        outputsByTx.set(txHash, []);
      }
    }),
  );

  const resolved: ValidationInput[] = [];
  const errors: ResolvedInputError[] = [];

  for (const input of inputs) {
    const output = outputsByTx.get(input.txHash)?.[input.index];
    if (!output) {
      errors.push({ txHash: input.txHash, index: input.index, reason: "UTxO not found" });
      continue;
    }
    resolved.push({ txHash: input.txHash, index: input.index, bytes: output.bytes });
  }

  return { resolved, errors };
}
