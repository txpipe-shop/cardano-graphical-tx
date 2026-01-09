import { env } from '$env/dynamic/private';
import { z } from 'zod/v4';
import { building } from '$app/environment';

type PrivateEnv = {
  MAINNET_UTXORPC_API_KEY: string;
  MAINNET_UTXORPC_URL: string;
  MAINNET_BLOCKFROST_URL: string;
  MAINNET_BLOCKFROST_API_KEY: string;
  MAINNET_DB_SYNC_CONNECTION_STRING: string;

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

  AFVM_UTXORPC_API_KEY: string;
  AFVM_UTXORPC_URL: string;
  AFVM_BLOCKFROST_URL: string;
  AFVM_BLOCKFROST_API_KEY: string;
  AFVM_DB_SYNC_CONNECTION_STRING: string;

  AFVT_UTXORPC_API_KEY: string;
  AFVT_UTXORPC_URL: string;
  AFVT_BLOCKFROST_URL: string;
  AFVT_BLOCKFROST_API_KEY: string;
  AFVT_DB_SYNC_CONNECTION_STRING: string;

  AFPT_UTXORPC_API_KEY: string;
  AFPT_UTXORPC_URL: string;
  AFPT_BLOCKFROST_URL: string;
  AFPT_BLOCKFROST_API_KEY: string;
  AFPT_DB_SYNC_CONNECTION_STRING: string;

  AFPM_UTXORPC_API_KEY: string;
  AFPM_UTXORPC_URL: string;
  AFPM_BLOCKFROST_URL: string;
  AFPM_BLOCKFROST_API_KEY: string;
  AFPM_DB_SYNC_CONNECTION_STRING: string;

  LOCAL_UTXORPC_URL: string;
  LOCAL_BLOCKFROST_URL: string;
};

let privateEnv: PrivateEnv;

// only required at runtime
if (building) {
  // create a placeholder object during build
  privateEnv = {
    MAINNET_UTXORPC_API_KEY: '',
    MAINNET_UTXORPC_URL: '',
    MAINNET_BLOCKFROST_URL: '',
    MAINNET_BLOCKFROST_API_KEY: '',
    MAINNET_DB_SYNC_CONNECTION_STRING: '',

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

    AFVM_UTXORPC_API_KEY: '',
    AFVM_UTXORPC_URL: '',
    AFVM_BLOCKFROST_URL: '',
    AFVM_BLOCKFROST_API_KEY: '',
    AFVM_DB_SYNC_CONNECTION_STRING: '',

    AFVT_UTXORPC_API_KEY: '',
    AFVT_UTXORPC_URL: '',
    AFVT_BLOCKFROST_URL: '',
    AFVT_BLOCKFROST_API_KEY: '',
    AFVT_DB_SYNC_CONNECTION_STRING: '',

    AFPM_UTXORPC_API_KEY: '',
    AFPM_UTXORPC_URL: '',
    AFPM_BLOCKFROST_URL: '',
    AFPM_BLOCKFROST_API_KEY: '',
    AFPM_DB_SYNC_CONNECTION_STRING: '',

    AFPT_UTXORPC_API_KEY: '',
    AFPT_UTXORPC_URL: '',
    AFPT_BLOCKFROST_URL: '',
    AFPT_BLOCKFROST_API_KEY: '',
    AFPT_DB_SYNC_CONNECTION_STRING: '',

    LOCAL_UTXORPC_URL: '',
    LOCAL_BLOCKFROST_URL: ''
  };
} else {
  const runtimeEnvSchema = z.object({
    MAINNET_UTXORPC_API_KEY: z.string().min(1),
    MAINNET_UTXORPC_URL: z.string().min(1),
    MAINNET_BLOCKFROST_URL: z.string().url(),
    MAINNET_BLOCKFROST_API_KEY: z.string().min(1),
    MAINNET_DB_SYNC_CONNECTION_STRING: z.string().url(),

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

    AFVM_UTXORPC_API_KEY: z.string().min(1),
    AFVM_UTXORPC_URL: z.string().min(1),
    AFVM_BLOCKFROST_URL: z.string().url(),
    AFVM_BLOCKFROST_API_KEY: z.string().min(1),
    AFVM_DB_SYNC_CONNECTION_STRING: z.string().url(),

    AFVT_UTXORPC_API_KEY: z.string().min(1),
    AFVT_UTXORPC_URL: z.string().min(1),
    AFVT_BLOCKFROST_URL: z.string().url(),
    AFVT_BLOCKFROST_API_KEY: z.string().min(1),
    AFVT_DB_SYNC_CONNECTION_STRING: z.string().url(),

    AFPT_UTXORPC_API_KEY: z.string().min(1),
    AFPT_UTXORPC_URL: z.string().min(1),
    AFPT_BLOCKFROST_URL: z.string().url(),
    AFPT_BLOCKFROST_API_KEY: z.string().min(1),
    AFPT_DB_SYNC_CONNECTION_STRING: z.string().url(),

    AFPM_UTXORPC_API_KEY: z.string().min(1),
    AFPM_UTXORPC_URL: z.string().min(1),
    AFPM_BLOCKFROST_URL: z.string().url(),
    AFPM_BLOCKFROST_API_KEY: z.string().min(1),
    AFPM_DB_SYNC_CONNECTION_STRING: z.string().url(),

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
