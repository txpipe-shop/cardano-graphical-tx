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
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_CBOR_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_PREPROD_BLOCKFROST_KEY: z.string(),
    NEXT_PUBLIC_MAINNET_BLOCKFROST_KEY: z.string(),
    NEXT_PUBLIC_PREVIEW_BLOCKFROST_KEY: z.string(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_PREPROD_BLOCKFROST_KEY:
      process.env.NEXT_PUBLIC_PREPROD_BLOCKFROST_KEY,
    NEXT_PUBLIC_MAINNET_BLOCKFROST_KEY:
      process.env.NEXT_PUBLIC_MAINNET_BLOCKFROST_KEY,
    NEXT_PUBLIC_PREVIEW_BLOCKFROST_KEY:
      process.env.NEXT_PUBLIC_PREVIEW_BLOCKFROST_KEY,
    NEXT_PUBLIC_CBOR_ENDPOINT: process.env.NEXT_PUBLIC_CBOR_ENDPOINT,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
});
