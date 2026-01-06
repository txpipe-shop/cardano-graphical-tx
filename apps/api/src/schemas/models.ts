import { z } from 'zod';
import { registry } from '../openapi.js';

export const BlockSchema = registry.register(
  'Block',
  z.object({
    height: z.number().int().describe('Block height').openapi({ example: 12345 }),
    hash: z
      .string()
      .describe('Block hash (hex string)')
      .regex(/^(0x)?[0-9a-fA-F]{64}$/)
      .openapi({ example: 'a1b2c3d4e5f6...' }),
    slot: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe('Slot number (UTXO networks only)')
      .openapi({ example: 12345678 }),
    epoch: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe('Epoch number (UTXO networks only)')
      .openapi({ example: 42 }),
    tx_count: z.number().int().describe('Number of transactions in block').openapi({ example: 15 }),
    timestamp: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .describe('Block timestamp')
      .openapi({ example: '2024-01-15T10:30:00Z' }),
    time: z
      .string()
      .nullable()
      .optional()
      .describe('Human-readable relative time (e.g., "5s ago", "2m ago")')
      .openapi({ example: '5s ago' }),
    confirmations: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe('Number of confirmations')
      .openapi({ example: 100 }),
    gas_used: z.number().int().nullable().optional().describe('Gas used (EVM networks only)')
  })
);

export const BlocksResponseSchema = registry.register(
  'BlocksResponse',
  z.object({
    blocks: z.array(BlockSchema)
  })
);

export const TransactionSchema = registry.register(
  'Transaction',
  z.object({
    hash: z
      .string()
      .describe('Transaction hash')
      .regex(/^(0x)?[0-9a-fA-F]{64}$/)
      .openapi({ example: 'a1b2c3d4e5f6...' }),
    block_height: z.number().int().describe('Block height').openapi({ example: 12345 }),
    block_hash: z.string().describe('Block hash').openapi({ example: 'a1b2c3d4e5f6...' }),
    timestamp: z
      .string()
      .datetime()
      .describe('Transaction timestamp')
      .openapi({ example: '2024-01-15T10:30:00Z' }),
    fee: z.string().describe('Transaction fee').openapi({ example: '150000' }),
    size: z.number().int().describe('Transaction size in bytes').openapi({ example: 350 }),
    status: z
      .enum(['success', 'pending', 'failed'])
      .describe('Transaction status')
      .openapi({ example: 'success' }),
    inputs: z.array(z.any()).describe('Transaction inputs'), // Simplified as per need, spec was vague on exact input structure in the snippet seen, assuming common struct or any
    outputs: z.array(z.any()).describe('Transaction outputs'),
    gas_used: z.number().int().nullable().optional().describe('Gas used (EVM)'),
    gas_price: z.string().nullable().optional().describe('Gas price (EVM)')
  })
);

export const TransactionsResponseSchema = registry.register(
  'TransactionsResponse',
  z.object({
    transactions: z.array(TransactionSchema)
  })
);

export const AddressSchema = registry.register(
  'Address',
  z.object({
    address: z.string().describe('Address string'),
    balance: z.string().describe('Balance in native currency'),
    tx_count: z.number().int().describe('Number of transactions'),
    tokens: z
      .array(
        z.object({
          policy: z.string(),
          name: z.string(),
          amount: z.string()
        })
      )
      .describe('Token balances')
  })
);

export const StatsSchema = registry.register(
  'Stats',
  z.object({
    network_name: z.string(),
    block_height: z.number().int(),
    tx_count: z.number().int(),
    address_count: z.number().int(),
    circulating_supply: z.string(),
    epoch: z.number().int().optional()
  })
);

export const TokenSchema = registry.register(
  'Token',
  z.object({
    identifier: z.string(),
    name: z.string().optional(),
    ticker: z.string().optional(),
    policy_id: z.string().optional(),
    asset_name: z.string().optional(),
    contract_address: z.string().optional(),
    total_supply: z.string(),
    decimals: z.number().int().optional()
  })
);

export const TokensResponseSchema = registry.register(
  'TokensResponse',
  z.object({
    tokens: z.array(TokenSchema)
  })
);

export const TokenHoldersResponseSchema = registry.register(
  'TokenHoldersResponse',
  z.object({
    holders: z.array(
      z.object({
        address: z.string(),
        amount: z.string()
      })
    )
  })
);

export const TokenTransfersResponseSchema = registry.register(
  'TokenTransfersResponse',
  z.object({
    transfers: z.array(
      z.object({
        tx_hash: z.string(),
        from_address: z.string(),
        to_address: z.string(),
        amount: z.string(),
        timestamp: z.string().datetime()
      })
    )
  })
);

export const EpochSchema = registry.register(
  'Epoch',
  z.object({
    number: z.number().int(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    tx_count: z.number().int(),
    output: z.string(),
    fees: z.string(),
    active_stake: z.string().optional()
  })
);

export const EpochsResponseSchema = registry.register(
  'EpochsResponse',
  z.object({
    epochs: z.array(EpochSchema)
  })
);

export const PoolSchema = registry.register(
  'Pool',
  z.object({
    id: z.string(),
    name: z.string().optional(),
    ticker: z.string().optional(),
    pledge: z.string(),
    margin: z.number(),
    cost: z.string(),
    live_stake: z.string(),
    blocks_minted: z.number().int()
  })
);

export const PoolsResponseSchema = registry.register(
  'PoolsResponse',
  z.object({
    pools: z.array(PoolSchema)
  })
);

export const ContractSchema = registry.register(
  'Contract',
  z.object({
    address: z.string(),
    name: z.string().optional(),
    compiler_version: z.string().optional(),
    verified: z.boolean(),
    abi: z.array(z.any()).optional(),
    source_code: z.string().optional()
  })
);

export const ContractsResponseSchema = registry.register(
  'ContractsResponse',
  z.object({
    contracts: z.array(ContractSchema)
  })
);

export const GasEstimateSchema = registry.register(
  'GasEstimate',
  z.object({
    slow: z.string(),
    standard: z.string(),
    fast: z.string(),
    timestamp: z.string().datetime()
  })
);

export const PriceSchema = registry.register(
  'Price',
  z.object({
    price: z.number(),
    currency: z.string(),
    timestamp: z.string().datetime()
  })
);

export const ChartDataSchema = registry.register(
  'ChartData',
  z.array(
    z.object({
      time: z.string(),
      value: z.number()
    })
  )
);
