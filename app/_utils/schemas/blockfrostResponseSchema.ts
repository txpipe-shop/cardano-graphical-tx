import { z } from "zod";

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

const OutputAmountSchema = z.object({
  unit: z.string(),
  quantity: z.string(),
});

const BlockfrostResponseSchema = z.object({
  hash: z.string(),
  inputs: z.array(InputSchema),
  outputs: z.array(OutputSchema),
  block: z.string(),
  block_height: z.number(),
  block_time: z.number(),
  slot: z.number(),
  index: z.number(),
  output_amount: z.array(OutputAmountSchema),
  fees: z.string(),
  deposit: z.string(),
  size: z.number(),
  invalid_before: z.string().nullable(),
  invalid_hereafter: z.string().nullable(),
  utxo_count: z.number(),
  withdrawal_count: z.number(),
  mir_cert_count: z.number(),
  delegation_count: z.number(),
  stake_cert_count: z.number(),
  pool_update_count: z.number(),
  pool_retire_count: z.number(),
  asset_mint_or_burn_count: z.number(),
  redeemer_count: z.number(),
  valid_contract: z.boolean(),
});

export default BlockfrostResponseSchema;
