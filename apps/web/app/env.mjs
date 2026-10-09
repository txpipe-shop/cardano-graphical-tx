import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NODE_ENV: z.string(),
    PREPROD_BLOCKFROST_KEY: z.string(),
    MAINNET_BLOCKFROST_KEY: z.string(),
    PREVIEW_BLOCKFROST_KEY: z.string(),
    MAINNET_DOLOS_BLOCKFROST_URL: z.string().optional(),
    PREPROD_DOLOS_BLOCKFROST_URL: z.string().optional(),
    PREVIEW_DOLOS_BLOCKFROST_URL: z.string().optional(),
    MAINNET_DOLOS_BLOCKFROST_API_KEY: z.string().optional(),
    PREPROD_DOLOS_BLOCKFROST_API_KEY: z.string().optional(),
    PREVIEW_DOLOS_BLOCKFROST_API_KEY: z.string().optional(),
    MAINNET_DOLOS_UTXORPC_URL: z.string().optional(),
    PREPROD_DOLOS_UTXORPC_URL: z.string().optional(),
    PREVIEW_DOLOS_UTXORPC_URL: z.string().optional(),
    MAINNET_DOLOS_UTXORPC_API_KEY: z.string().optional(),
    PREPROD_DOLOS_UTXORPC_API_KEY: z.string().optional(),
    PREVIEW_DOLOS_UTXORPC_API_KEY: z.string().optional(),
    UPSTREAM_GRPC_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
    UPSTREAM_HTTP_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
    UPSTREAM_CACHE_IMMUTABLE_MB: z.coerce.number().int().positive().optional(),
    UPSTREAM_CACHE_MUTABLE_MB: z.coerce.number().int().positive().optional(),
    UPSTREAM_CACHE_TTL_MS: z.coerce.number().int().positive().optional(),
    UPSTREAM_REQUEST_LOG: z.enum(["0", "1"]).optional(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_CBOR_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    PREPROD_BLOCKFROST_KEY: process.env.PREPROD_BLOCKFROST_KEY,
    MAINNET_BLOCKFROST_KEY: process.env.MAINNET_BLOCKFROST_KEY,
    PREVIEW_BLOCKFROST_KEY: process.env.PREVIEW_BLOCKFROST_KEY,
    NEXT_PUBLIC_CBOR_ENDPOINT: process.env.NEXT_PUBLIC_CBOR_ENDPOINT,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    NODE_ENV: process.env.NODE_ENV,
    MAINNET_DOLOS_BLOCKFROST_URL: process.env.MAINNET_DOLOS_BLOCKFROST_URL,
    PREPROD_DOLOS_BLOCKFROST_URL: process.env.PREPROD_DOLOS_BLOCKFROST_URL,
    PREVIEW_DOLOS_BLOCKFROST_URL: process.env.PREVIEW_DOLOS_BLOCKFROST_URL,
    MAINNET_DOLOS_BLOCKFROST_API_KEY:
      process.env.MAINNET_DOLOS_BLOCKFROST_API_KEY,
    PREPROD_DOLOS_BLOCKFROST_API_KEY:
      process.env.PREPROD_DOLOS_BLOCKFROST_API_KEY,
    PREVIEW_DOLOS_BLOCKFROST_API_KEY:
      process.env.PREVIEW_DOLOS_BLOCKFROST_API_KEY,
    MAINNET_DOLOS_UTXORPC_URL: process.env.MAINNET_DOLOS_UTXORPC_URL,
    PREPROD_DOLOS_UTXORPC_URL: process.env.PREPROD_DOLOS_UTXORPC_URL,
    PREVIEW_DOLOS_UTXORPC_URL: process.env.PREVIEW_DOLOS_UTXORPC_URL,
    MAINNET_DOLOS_UTXORPC_API_KEY: process.env.MAINNET_DOLOS_UTXORPC_API_KEY,
    PREPROD_DOLOS_UTXORPC_API_KEY: process.env.PREPROD_DOLOS_UTXORPC_API_KEY,
    PREVIEW_DOLOS_UTXORPC_API_KEY: process.env.PREVIEW_DOLOS_UTXORPC_API_KEY,
    UPSTREAM_GRPC_TIMEOUT_MS: process.env.UPSTREAM_GRPC_TIMEOUT_MS,
    UPSTREAM_HTTP_TIMEOUT_MS: process.env.UPSTREAM_HTTP_TIMEOUT_MS,
    UPSTREAM_CACHE_IMMUTABLE_MB: process.env.UPSTREAM_CACHE_IMMUTABLE_MB,
    UPSTREAM_CACHE_MUTABLE_MB: process.env.UPSTREAM_CACHE_MUTABLE_MB,
    UPSTREAM_CACHE_TTL_MS: process.env.UPSTREAM_CACHE_TTL_MS,
    UPSTREAM_REQUEST_LOG: process.env.UPSTREAM_REQUEST_LOG,
  },
  emptyStringAsUndefined: true,
  skipValidation:
    process.env.SKIP_VALIDATION === "1" || process.env.CI === "true",
});
