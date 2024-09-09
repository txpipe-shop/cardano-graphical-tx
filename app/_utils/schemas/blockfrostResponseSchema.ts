import { z } from "zod";

export const BlockfrostResponseSchema = z.object({
  cbor: z.string(),
});

const AmountSchema = z.object({
  unit: z.string(),
  quantity: z.string(),
});

const InputSchema = z.object({
  address: z.string(),
  amount: z.array(AmountSchema),
  tx_hash: z.string(),
  output_index: z.number(),
  data_hash: z.string().nullable(),
  inline_datum: z.string().nullable(),
  reference_script_hash: z.string().nullable(),
  collateral: z.boolean(),
  reference: z.boolean().optional(),
});

const OutputSchema = z.object({
  address: z.string(),
  amount: z.array(AmountSchema),
  output_index: z.number(),
  data_hash: z.string().nullable(),
  inline_datum: z.string().nullable(),
  collateral: z.boolean(),
  reference_script_hash: z.string().nullable(),
});

export const BlockfrostUTxOSchema = z.object({
  hash: z.string(),
  inputs: z.array(InputSchema),
  outputs: z.array(OutputSchema),
});
