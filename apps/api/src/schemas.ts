import { z } from 'zod';

export const NetworkSchema = z.enum(['prime', 'vector', 'nexus']);
export type Network = z.infer<typeof NetworkSchema>;

export const PaginationSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean()
});

export const BlockSchema = z.object({
  height: z.number(),
  hash: z.string(),
  slot: z.number().nullable().optional(),
  epoch: z.number().nullable().optional(),
  tx_count: z.number(),
  timestamp: z.string().datetime().nullable(),
  time: z.string().nullable().optional(),
  confirmations: z.number().nullable().optional(),
  gas_used: z.number().nullable().optional(),
  gas_limit: z.number().nullable().optional(),
  size: z.number().nullable().optional(),
  base_fee_per_gas: z.number().nullable().optional()
});

export const BlocksResponseSchema = z.object({
  blocks: z.array(BlockSchema),
  pagination: PaginationSchema
});

export const TransactionInputSchema = z.object({
  address: z.string(),
  address_bech32: z.string().nullable().optional(),
  utxo_id: z.string().nullable().optional(),
  input_index: z.number().nullable().optional(),
  amount_ada: z.number().nullable().optional(),
  amount_lovelace: z.number().nullable().optional()
});

export const TokenBalanceSchema = z.object({
  token_address: z.string().nullable().optional(),
  policy_id: z.string().nullable().optional(),
  asset_name: z.string().nullable().optional(),
  asset_name_hex: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  token_name: z.string().nullable().optional(),
  symbol: z.string().nullable().optional(),
  token_symbol: z.string().nullable().optional(),
  decimals: z.number().nullable().optional(),
  balance: z.string().nullable().optional(),
  balance_formatted: z.number().nullable().optional(),
  value: z.string().nullable().optional(),
  quantity: z.string().nullable().optional(),
  fingerprint: z.string().nullable().optional()
});

export const TransactionOutputSchema = z.object({
  address: z.string(),
  address_bech32: z.string().nullable().optional(),
  output_index: z.number(),
  amount_ada: z.number().nullable().optional(),
  amount_lovelace: z.number().nullable().optional(),
  tokens: z.array(TokenBalanceSchema).nullable().optional()
});

export const TransactionSchema = z.object({
  hash: z.string(),
  block_height: z.number(),
  block_slot: z.number().nullable().optional(),
  slot: z.number().nullable().optional(),
  epoch: z.number().nullable().optional(),
  index: z.number().nullable().optional(),
  tx_index: z.number().nullable().optional(),
  from_addresses: z.array(z.string()).nullable().optional(),
  to_addresses: z.array(z.string()).nullable().optional(),
  from_addresses_bech32: z.array(z.string()).nullable().optional(),
  to_addresses_bech32: z.array(z.string()).nullable().optional(),
  input_count: z.number().nullable().optional(),
  output_count: z.number().nullable().optional(),
  ada_amount: z.number().nullable().optional(),
  total_input_ada: z.number().nullable().optional(),
  total_output_ada: z.number().nullable().optional(),
  fee: z.number().nullable().optional(),
  fee_ada: z.number().nullable().optional(),
  status: z.enum(['success', 'failed', 'confirmed', 'invalid', 'pending']),
  is_valid: z.boolean().nullable().optional(),
  confirmations: z.number().nullable().optional(),
  timestamp: z.string().datetime().nullable(),
  block_hash: z.string().nullable().optional(),
  inputs: z.array(TransactionInputSchema).nullable().optional(),
  outputs: z.array(TransactionOutputSchema).nullable().optional(),
  gas_used: z.number().nullable().optional(),
  gas_price: z.number().nullable().optional(),
  gas_limit: z.number().nullable().optional(),
  nonce: z.number().nullable().optional(),
  method: z.string().nullable().optional(),
  evmType: z.string().nullable().optional(),
  error: z.string().nullable().optional()
});

export const TransactionsResponseSchema = z.object({
  transactions: z.array(TransactionSchema),
  pagination: PaginationSchema
});

export const UTXOSchema = z.object({
  utxo_id: z.string(),
  tx_hash: z.string(),
  output_index: z.number(),
  amount_ada: z.number(),
  amount_lovelace: z.number(),
  block_height: z.number(),
  slot: z.number()
});

export const AddressTransactionSchema = z.object({
  hash: z.string(),
  block_height: z.number(),
  slot: z.number().nullable(),
  tx_index: z.number(),
  type: z.enum(['sent', 'received', 'both']),
  amount_ada: z.number(),
  amount_lovelace: z.number().nullable(),
  received_ada: z.number(),
  sent_ada: z.number(),
  timestamp: z.string().datetime().nullable()
});

export const AddressSchema = z.object({
  address: z.string(),
  address_bech32: z.string().nullable().optional(),
  balance_ada: z.number(),
  balance_lovelace: z.number().nullable().optional(),
  tx_count: z.number(),
  unspent_utxo_count: z.number().nullable().optional(),
  total_utxo_count: z.number().nullable().optional(),
  first_seen_slot: z.number().nullable().optional(),
  last_seen_slot: z.number().nullable().optional(),
  first_seen_height: z.number().nullable().optional(),
  last_seen_height: z.number().nullable().optional(),
  utxos: z.array(UTXOSchema).nullable().optional(),
  transactions: z.array(AddressTransactionSchema),
  tokens: z.array(TokenBalanceSchema)
});

export const StatsSchema = z.object({
  blockHeight: z.string(),
  transactions: z.string(),
  addresses: z.string(),
  avgBlockTime: z.string()
});

export const TokenSchema = z.object({
  address: z.string().nullable().optional(),
  policy_id: z.string().nullable().optional(),
  asset_name: z.string().nullable().optional(),
  asset_name_hex: z.string().nullable().optional(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  total_supply: z.string(),
  total_supply_formatted: z.string(),
  quantity: z.string().nullable().optional(),
  holders: z.number().nullable().optional(),
  type: z.string().nullable().optional(),
  icon_url: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
  fingerprint: z.string().nullable().optional()
});

export const TokensResponseSchema = z.object({
  tokens: z.array(TokenSchema),
  pagination: PaginationSchema
});

export const TokenTransferSchema = z.object({
  transaction_hash: z.string(),
  hash: z.string().nullable().optional(),
  from: z.string().nullable().optional(),
  from_address: z.string().nullable().optional(),
  from_address_hash: z.string().nullable().optional(),
  to: z.string().nullable().optional(),
  to_address: z.string().nullable().optional(),
  to_address_hash: z.string().nullable().optional(),
  amount: z.number().nullable().optional(),
  amount_raw: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  block_number: z.number(),
  block_timestamp: z.string().datetime().nullable(),
  timestamp: z.string().datetime().nullable(),
  log_index: z.number().nullable().optional(),
  token_address: z.string().nullable().optional(),
  token_contract_address_hash: z.string().nullable().optional(),
  token_symbol: z.string().nullable().optional(),
  token_name: z.string().nullable().optional(),
  token_decimals: z.number().nullable().optional()
});

export const TokenTransfersResponseSchema = z.object({
  transfers: z.array(TokenTransferSchema),
  pagination: PaginationSchema
});

export const TokenHoldersResponseSchema = z.object({
  holders: z.array(
    z.object({
      address: z.string(),
      value: z.string(),
      balance: z.string()
    })
  ),
  pagination: PaginationSchema
});

export const EpochSchema = z.object({
  epoch: z.number(),
  start_slot: z.number(),
  end_slot: z.number(),
  actual_start_slot: z.number().nullable().optional(),
  actual_end_slot: z.number().nullable().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  start_height: z.number(),
  end_height: z.number(),
  blocks: z.number().nullable().optional(),
  block_count: z.number().nullable().optional(),
  transactions: z.number().nullable().optional(),
  transaction_count: z.number().nullable().optional(),
  fees: z.string().nullable().optional(),
  is_current: z.boolean().nullable().optional(),
  current_epoch: z.number().nullable().optional(),
  blocks_list: z
    .array(
      z.object({
        height: z.number().optional(),
        slot: z.number().optional(),
        hash: z.string().optional(),
        tx_count: z.number().optional()
      })
    )
    .optional()
});

export const EpochsResponseSchema = z.object({
  epochs: z.array(
    z.object({
      epoch: z.number(),
      start_slot: z.number(),
      end_slot: z.number(),
      start_time: z.string().datetime().nullable().optional(),
      end_time: z.string().datetime().nullable().optional(),
      blocks: z.number().nullable().optional(),
      block_count: z.number().nullable().optional(),
      transactions: z.number().nullable().optional(),
      transaction_count: z.number().nullable().optional(),
      fees: z.string().nullable().optional(),
      is_current: z.boolean().nullable().optional()
    })
  ),
  current_epoch: z.number().nullable().optional(),
  pagination: PaginationSchema
});

export const PoolSchema = z.object({
  poolId: z.string(),
  hex: z.string(),
  ticker: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  homepage: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  meta: z
    .object({
      name: z.string().nullable().optional(),
      ticker: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      homepage: z.string().nullable().optional(),
      logo: z.string().nullable().optional()
    })
    .nullable()
    .optional(),
  stake: z.string().nullable().optional(),
  delegators: z.number().nullable().optional(),
  margin: z.number().nullable().optional(),
  fixed_cost: z.string().nullable().optional(),
  cost: z.string().nullable().optional(),
  pledge: z.string().nullable().optional()
});

export const PoolsResponseSchema = z.object({
  pools: z.array(PoolSchema),
  pagination: PaginationSchema,
  totals: z
    .object({
      total_pools: z.number().optional(),
      total_stake: z.string().optional(),
      total_delegators: z.number().optional()
    })
    .nullable()
    .optional()
});

export const ContractSchema = z.object({
  address: z.string(),
  name: z.string(),
  verified: z.boolean(),
  compiler: z.string().nullable().optional(),
  balance: z.string().nullable().optional(),
  balance_ada: z.number().nullable().optional(),
  tx_count: z.number(),
  created: z.string().nullable().optional(),
  verified_at: z.string().datetime().nullable().optional(),
  optimization_enabled: z.boolean().nullable().optional(),
  optimization_runs: z.number().nullable().optional(),
  evm_version: z.string().nullable().optional(),
  abi: z.array(z.object({})).nullable().optional(),
  source_code: z.string().nullable().optional()
});

export const ContractsResponseSchema = z.object({
  contracts: z.array(ContractSchema),
  pagination: PaginationSchema
});

export const GasEstimateSchema = z.object({
  slow: z.object({ gwei: z.number(), dfm: z.number(), time: z.string() }),
  standard: z.object({ gwei: z.number(), dfm: z.number(), time: z.string() }),
  fast: z.object({ gwei: z.number(), dfm: z.number(), time: z.string() }),
  instant: z.object({ gwei: z.number(), dfm: z.number(), time: z.string() }),
  recentBlocks: z
    .array(
      z.object({
        number: z.number(),
        gasUsed: z.number().nullable().optional(),
        gas_used: z.number().nullable().optional(),
        gasLimit: z.number().nullable().optional(),
        gas_limit: z.number().nullable().optional(),
        baseFee: z.number().nullable().optional(),
        baseFeeGwei: z.number().nullable().optional(),
        usage: z.number().nullable().optional(),
        timestamp: z.string().datetime().nullable().optional()
      })
    )
    .nullable()
    .optional(),
  recent_blocks: z.array(z.object({})).nullable().optional(),
  averageGasPrice: z.number().nullable().optional()
});

export const PriceSchema = z.object({
  price: z.number(),
  change_24h: z.number().nullable().optional(),
  market_cap: z.string().nullable().optional(),
  volume_24h: z.string().nullable().optional(),
  source: z.string().nullable().optional()
});

export const ChartDataSchema = z.object({
  hourly: z.array(
    z.object({
      time: z.string(),
      count: z.number()
    })
  ),
  breakdown: z
    .object({
      total: z.number().optional(),
      contract_calls: z.number().optional(),
      contract_deploys: z.number().optional(),
      token_transfers: z.number().optional(),
      regular_transfers: z.number().optional()
    })
    .optional()
});
