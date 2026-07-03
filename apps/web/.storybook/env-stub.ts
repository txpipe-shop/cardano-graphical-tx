// Stub for app/env.mjs — skips t3-oss/env-nextjs validation in Storybook
// Required env vars are not available in the Storybook browser context.

export const env = {
  NODE_ENV: "development",
  PREPROD_BLOCKFROST_KEY: "",
  MAINNET_BLOCKFROST_KEY: "",
  PREVIEW_BLOCKFROST_KEY: "",
  MAINNET_DOLOS_BLOCKFROST_URL: undefined,
  PREPROD_DOLOS_BLOCKFROST_URL: undefined,
  PREVIEW_DOLOS_BLOCKFROST_URL: undefined,
  MAINNET_DOLOS_BLOCKFROST_API_KEY: undefined,
  PREPROD_DOLOS_BLOCKFROST_API_KEY: undefined,
  PREVIEW_DOLOS_BLOCKFROST_API_KEY: undefined,
  MAINNET_DOLOS_UTXORPC_URL: undefined,
  PREPROD_DOLOS_UTXORPC_URL: undefined,
  PREVIEW_DOLOS_UTXORPC_URL: undefined,
  MAINNET_DOLOS_UTXORPC_API_KEY: undefined,
  PREPROD_DOLOS_UTXORPC_API_KEY: undefined,
  PREVIEW_DOLOS_UTXORPC_API_KEY: undefined,
  NEXT_PUBLIC_CBOR_ENDPOINT: "http://localhost:3000/tx",
  NEXT_PUBLIC_GA_TRACKING_ID: undefined,
};
