import { DbSyncProvider } from "@laceanatomy/cardano-provider-dbsync";
import pg from "pg";

export type ChainNetwork = "mainnet" | "preprod" | "preview" | "vector-mainnet";

const poolCache: Map<ChainNetwork, pg.Pool> = new Map();

function getConnectionString(chain: ChainNetwork): string {
  // TODO: Vector network doesn't have its own dbsync yet, redirect to mainnet
  // Remove this fallback when Vector dbsync is available
  if (chain === "vector-mainnet") {
    console.warn(
      "[DBSYNC] Vector network not available, falling back to mainnet",
    );
    return process.env.MAINNET_DB_SYNC || "";
  }

  switch (chain) {
    case "mainnet":
      return process.env.MAINNET_DB_SYNC || "";
    case "preprod":
      return process.env.PREPROD_DB_SYNC || "";
    case "preview":
      return process.env.PREVIEW_DB_SYNC || "";
    default:
      return process.env.MAINNET_DB_SYNC || "";
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

  return new DbSyncProvider({ pool, addrPrefix });
}

export function isValidChain(chain: string): chain is ChainNetwork {
  return ["mainnet", "preprod", "preview", "vector"].includes(chain);
}
