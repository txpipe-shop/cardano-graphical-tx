import { z } from "zod";

const networkSchema = z.enum(["mainnet", "preprod", "preview"], {
  required_error: "Network is required",
});

export const getTxFromCBORSchema = z.object({
  network: networkSchema,
  cbor: z.string({ required_error: "CBOR is required" }),
});

export const getTxFromHashSchema = z.object({
  network: networkSchema,
  txId: z
    .string({ required_error: "Transaction hash is required" })
    .min(64, { message: "Transaction hash is too short" })
    .max(64, { message: "Transaction hash is too long" }),
});

export const getDSLFromSchema = z.object({
  dsl: z.string({ required_error: "JSON is required" }),
});

export const getAddressFromScema = z.object({
  raw: z.string({ required_error: "Address is required" }),
});
