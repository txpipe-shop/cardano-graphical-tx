import {
  cborParse,
  validateCborTx,
  type ValidationResponse,
} from "@laceanatomy/napi-pallas";
import {
  currentSlot,
  NETWORK,
  NETWORK_ID,
  NETWORK_MAGIC,
  type Network,
} from "@laceanatomy/types/cardano";
import { resolveInputs } from "~/server/api/resolve-utxos";
import { getUtxoRpcClient } from "~/server/api/utxorpc-client";
import { ValidationSetupError } from "./errors";
import { fetchCurrentPParamsFromUtxorpc } from "./pparams";

type ValidateCurrentTxInput = {
  cbor: string;
  network: Network;
  slot?: number;
};

function validationFailure(rule: string, error: string): ValidationResponse {
  return {
    era: "unknown",
    checks: [{ rule, passed: false, error }],
    valid: false,
  };
}

export async function validateCurrentTx({
  cbor,
  network,
  slot: providedSlot,
}: ValidateCurrentTxInput): Promise<ValidationResponse> {
  if (network === NETWORK.DEVNET) {
    return validationFailure("unsupported", "Devnet validation not available");
  }

  const parsed = cborParse(cbor);
  if (parsed.error || !parsed.cborRes) {
    return validationFailure("decode", parsed.error || "Failed to parse CBOR");
  }

  const tx = parsed.cborRes;
  const inputs = [
    ...tx.inputs.map((i) => ({ txHash: i.txHash, index: i.index })),
    ...(tx.referenceInputs ?? []).map((i) => ({
      txHash: i.txHash,
      index: i.index,
    })),
    ...(tx.collateral?.inputs ?? []).map((i) => ({
      txHash: i.txHash,
      index: i.index,
    })),
  ];

  const utxoClient = getUtxoRpcClient(network);
  if (!utxoClient) {
    throw new ValidationSetupError(
      "UTxORPC endpoint not configured for this network",
    );
  }

  const [{ resolved: resolvedUtxos, errors: utxoErrors }, pparams] =
    await Promise.all([
      resolveInputs(inputs, utxoClient),
      fetchCurrentPParamsFromUtxorpc(utxoClient),
    ]);

  const result = validateCborTx(
    cbor,
    resolvedUtxos,
    pparams,
    BigInt(providedSlot ?? currentSlot(network)),
    NETWORK_ID[network],
    NETWORK_MAGIC[network],
  );

  for (const err of utxoErrors) {
    result.checks.unshift({
      rule: "utxo_resolution",
      passed: false,
      error: `${err.txHash}#${err.index}: ${err.reason}`,
    });
  }

  if (utxoErrors.length > 0) {
    result.valid = false;
  }

  return result;
}
