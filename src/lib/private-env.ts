import { z } from 'zod';
import { env } from '$env/dynamic/private';

const privateEnvSchema = z.object({
  UTXORPC_API_KEY: z.string().min(1).optional(),
  UTXORPC_URL: z.string().min(1),
  BLOCKFROST_URL: z.url(),
  BLOCKFROST_API_KEY: z.string().min(1).optional(),
  DB_SYNC_CONNECTION_STRING: z.url()
});

const parsed = privateEnvSchema.safeParse(env);

if (!parsed.success) {
  console.error('Invalid PRIVATE env vars:', parsed.error.format());
  throw new Error('Invalid PRIVATE environment variables');
}

export const privateEnv = parsed.data;
