import { env } from '$env/dynamic/private';
import { z } from 'zod/v4';
import { building } from '$app/environment';

type PrivateEnv = {
  PREPROD_UTXORPC_API_KEY: string;
  PREPROD_UTXORPC_URL: string;
  PREPROD_BLOCKFROST_URL: string;
  PREPROD_BLOCKFROST_API_KEY: string;
  PREPROD_DB_SYNC_CONNECTION_STRING: string;
  PREVIEW_UTXORPC_API_KEY: string;
  PREVIEW_UTXORPC_URL: string;
  PREVIEW_BLOCKFROST_URL: string;
  PREVIEW_BLOCKFROST_API_KEY: string;
  PREVIEW_DB_SYNC_CONNECTION_STRING: string;
  LOCAL_UTXORPC_URL: string;
  LOCAL_BLOCKFROST_URL: string;
};

let privateEnv: PrivateEnv;

// only required at runtime
if (building) {
  // create a placeholder object during build
  privateEnv = {
    PREPROD_UTXORPC_API_KEY: '',
    PREPROD_UTXORPC_URL: '',
    PREPROD_BLOCKFROST_URL: '',
    PREPROD_BLOCKFROST_API_KEY: '',
    PREPROD_DB_SYNC_CONNECTION_STRING: '',
    PREVIEW_UTXORPC_API_KEY: '',
    PREVIEW_UTXORPC_URL: '',
    PREVIEW_BLOCKFROST_URL: '',
    PREVIEW_BLOCKFROST_API_KEY: '',
    PREVIEW_DB_SYNC_CONNECTION_STRING: '',
    LOCAL_UTXORPC_URL: '',
    LOCAL_BLOCKFROST_URL: ''
  };
} else {
  const runtimeEnvSchema = z.object({
    PREPROD_UTXORPC_API_KEY: z.string().min(1),
    PREPROD_UTXORPC_URL: z.string().min(1),
    PREPROD_BLOCKFROST_URL: z.string().url(),
    PREPROD_BLOCKFROST_API_KEY: z.string().min(1),
    PREPROD_DB_SYNC_CONNECTION_STRING: z.string().url(),

    PREVIEW_UTXORPC_API_KEY: z.string().min(1),
    PREVIEW_UTXORPC_URL: z.string().min(1),
    PREVIEW_BLOCKFROST_URL: z.string().url(),
    PREVIEW_BLOCKFROST_API_KEY: z.string().min(1),
    PREVIEW_DB_SYNC_CONNECTION_STRING: z.string().url(),

    LOCAL_UTXORPC_URL: z.string().min(1),
    LOCAL_BLOCKFROST_URL: z.string().url()
  });

  const parsed = runtimeEnvSchema.safeParse(env);

  if (!parsed.success) {
    console.error('Invalid PRIVATE env vars:', parsed.error.format());
    throw new Error('Invalid PRIVATE environment variables');
  }

  privateEnv = parsed.data;
}

export { privateEnv };
