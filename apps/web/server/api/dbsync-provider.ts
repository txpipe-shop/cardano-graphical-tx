import { DbSyncProvider } from "@laceanatomy/cardano-provider-dbsync";
import pg from "pg";
import { env } from "~/app/env.mjs";

export type ChainNetwork = "mainnet" | "preprod" | "preview" | "vector-mainnet";

const poolCache: Map<ChainNetwork, pg.Pool> = new Map();

function getConnectionString(chain: ChainNetwork): string {
  if (chain === "vector-mainnet") {
    return env.VECTOR_MAINNET_DB_SYNC || "";
  }

  switch (chain) {
    case "mainnet":
      return env.MAINNET_DB_SYNC || "";
    case "preprod":
      return env.PREPROD_DB_SYNC || "";
    case "preview":
      return env.PREVIEW_DB_SYNC || "";
    default:
      return env.MAINNET_DB_SYNC || "";
  }
}

function getNetworkMagic(chain: ChainNetwork): number {
  switch (chain) {
    case "mainnet":
      return env.MAINNET_MAGIC;
    case "preprod":
      return env.PREPROD_MAGIC;
    case "preview":
      return env.PREVIEW_MAGIC;
    case "vector-mainnet":
      return env.VECTOR_MAINNET_MAGIC;
  }
}

function getNodeUrl(chain: ChainNetwork): string {
  switch (chain) {
    case "mainnet":
      return env.MAINNET_NODE_URL;
    case "preprod":
      return env.PREPROD_NODE_URL;
    case "preview":
      return env.PREVIEW_NODE_URL;
    case "vector-mainnet":
      return env.VECTOR_MAINNET_NODE_URL;
  }
}

function getAddressPrefix(chain: ChainNetwork): string {
  switch (chain) {
    case "mainnet":
    case "vector-mainnet":
      return "addr";
    case "preprod":
    case "preview":
      return "addr_test";
    default:
      return "addr";
  }
}

function getPool(chain: ChainNetwork): pg.Pool {
  const cached = poolCache.get(chain);
  if (cached) return cached;

  const connectionString = getConnectionString(chain);
  if (!connectionString) {
    throw new Error(`No connection string configured for chain: ${chain}`);
  }

  const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  poolCache.set(chain, pool);
  return pool;
}

export function getDbSyncProvider(chain: ChainNetwork): DbSyncProvider {
  const pool = getPool(chain);
  const addrPrefix = getAddressPrefix(chain);
  const nodeUrl = getNodeUrl(chain);
  const magic = getNetworkMagic(chain);

  return new DbSyncProvider({
    pool,
    addrPrefix,
    nodeUrl,
    magic,
  });
}

export function isValidChain(chain: string): chain is ChainNetwork {
  const chains: ChainNetwork[] = [
    "mainnet",
    "preprod",
    "preview",
    "vector-mainnet",
  ];
  return chains.includes(chain as ChainNetwork);
}
