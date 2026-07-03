// Stub for @laceanatomy/napi-pallas — a native Rust module that can't run in the browser.
// Only runtime function imports need stubs; type-only imports are erased at compile time.

export const parseAddress = (_addr: string) => ({
  address: "",
  network: "mainnet" as const,
  prefix: "",
  script: false,
});

export const cborParse = (_hex: string) => ({});

export const cborEncode = (_obj: unknown) => "";

export const diagnostics = (_hex: string) => [];
