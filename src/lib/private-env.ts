import { z } from 'zod/v4';
import { env } from '$env/dynamic/private';

const privateEnvSchema = z.object({
  // PREPROD
  PREPROD_UTXORPC_API_KEY: z.string().min(1),
  PREPROD_UTXORPC_URL: z.string().min(1),
  PREPROD_BLOCKFROST_URL: z.url(),
  PREPROD_BLOCKFROST_API_KEY: z.string().min(1),
  PREPROD_DB_SYNC_CONNECTION_STRING: z.url(),

  // PREVIEW
  PREVIEW_UTXORPC_API_KEY: z.string().min(1),
  PREVIEW_UTXORPC_URL: z.string().min(1),
  PREVIEW_BLOCKFROST_URL: z.url(),
  PREVIEW_BLOCKFROST_API_KEY: z.string().min(1),
  PREVIEW_DB_SYNC_CONNECTION_STRING: z.url(),

  // MAINNET
  MAINNET_UTXORPC_API_KEY: z.string().min(1),
  MAINNET_UTXORPC_URL: z.string().min(1),
  MAINNET_BLOCKFROST_URL: z.url(),
  MAINNET_BLOCKFROST_API_KEY: z.string().min(1),
  MAINNET_DB_SYNC_CONNECTION_STRING: z.url(),

  // VECTOR TESTNET
  AF_VECTOR_TESTNET_UTXORPC_API_KEY: z.string().min(1),
  AF_VECTOR_TESTNET_UTXORPC_URL: z.string().min(1),
  AF_VECTOR_TESTNET_BLOCKFROST_URL: z.url(),
  AF_VECTOR_TESTNET_BLOCKFROST_API_KEY: z.string().min(1),
  AF_VECTOR_TESTNET_DB_SYNC_CONNECTION_STRING: z.url(),

  // VECTOR MAINNET
  AF_VECTOR_MAINNET_UTXORPC_API_KEY: z.string().min(1),
  AF_VECTOR_MAINNET_UTXORPC_URL: z.string().min(1),
  AF_VECTOR_MAINNET_BLOCKFROST_URL: z.url(),
  AF_VECTOR_MAINNET_BLOCKFROST_API_KEY: z.string().min(1),
  AF_VECTOR_MAINNET_DB_SYNC_CONNECTION_STRING: z.url(),

  // PRIME TESTNET
  AF_PRIME_TESTNET_UTXORPC_API_KEY: z.string().min(1),
  AF_PRIME_TESTNET_UTXORPC_URL: z.string().min(1),
  AF_PRIME_TESTNET_BLOCKFROST_URL: z.url(),
  AF_PRIME_TESTNET_BLOCKFROST_API_KEY: z.string().min(1),
  AF_PRIME_TESTNET_DB_SYNC_CONNECTION_STRING: z.url(),

  // PRIME MAINNET
  AF_PRIME_MAINNET_UTXORPC_API_KEY: z.string().min(1),
  AF_PRIME_MAINNET_UTXORPC_URL: z.string().min(1),
  AF_PRIME_MAINNET_BLOCKFROST_URL: z.url(),
  AF_PRIME_MAINNET_BLOCKFROST_API_KEY: z.string().min(1),
  AF_PRIME_MAINNET_DB_SYNC_CONNECTION_STRING: z.url()
});

const parsed = privateEnvSchema.safeParse(env);

if (!parsed.success) {
  console.error('Invalid PRIVATE env vars:', parsed.error.format());
  throw new Error('Invalid PRIVATE environment variables');
}

export const privateEnv = parsed.data;
