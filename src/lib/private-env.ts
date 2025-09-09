import { env } from '$env/dynamic/private';
import { z } from 'zod/v4';

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

  // LOCAL
  LOCAL_UTXORPC_URL: z.string().min(1).optional(),
  LOCAL_BLOCKFROST_URL: z.url().optional()
});

const parsed = privateEnvSchema.safeParse(env);

if (!parsed.success) {
  console.error('Invalid PRIVATE env vars:', parsed.error.format());
  throw new Error('Invalid PRIVATE environment variables');
}

export const privateEnv = parsed.data;
