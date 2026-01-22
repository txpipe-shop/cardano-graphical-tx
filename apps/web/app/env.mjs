import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    NODE_ENV: z.string(),
    PREPROD_BLOCKFROST_KEY: z.string(),
    MAINNET_BLOCKFROST_KEY: z.string(),
    PREVIEW_BLOCKFROST_KEY: z.string(),
    MAINNET_DB_SYNC: z.string(),
    PREPROD_DB_SYNC: z.string(),
    PREVIEW_DB_SYNC: z.string(),
    VECTOR_MAINNET_DB_SYNC: z.string(),
    MAINNET_MAGIC: z.coerce.number(),
    PREPROD_MAGIC: z.coerce.number(),
    PREVIEW_MAGIC: z.coerce.number(),
    VECTOR_MAINNET_MAGIC: z.coerce.number(),
    MAINNET_NODE_URL: z.string(),
    PREPROD_NODE_URL: z.string(),
    PREVIEW_NODE_URL: z.string(),
    VECTOR_MAINNET_NODE_URL: z.string(),
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
    MAINNET_DB_SYNC: process.env.MAINNET_DB_SYNC,
    PREPROD_DB_SYNC: process.env.PREPROD_DB_SYNC,
    PREVIEW_DB_SYNC: process.env.PREVIEW_DB_SYNC,
    VECTOR_MAINNET_DB_SYNC: process.env.VECTOR_MAINNET_DB_SYNC,
    NEXT_PUBLIC_CBOR_ENDPOINT: process.env.NEXT_PUBLIC_CBOR_ENDPOINT,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    MAINNET_MAGIC: process.env.MAINNET_MAGIC,
    PREPROD_MAGIC: process.env.PREPROD_MAGIC,
    PREVIEW_MAGIC: process.env.PREVIEW_MAGIC,
    VECTOR_MAINNET_MAGIC: process.env.VECTOR_MAINNET_MAGIC,
    MAINNET_NODE_URL: process.env.MAINNET_NODE_URL,
    PREPROD_NODE_URL: process.env.PREPROD_NODE_URL,
    PREVIEW_NODE_URL: process.env.PREVIEW_NODE_URL,
    VECTOR_MAINNET_NODE_URL: process.env.VECTOR_MAINNET_NODE_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_VALIDATION,
});
