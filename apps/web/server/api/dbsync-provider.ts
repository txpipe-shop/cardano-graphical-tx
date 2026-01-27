import { DbSyncProvider } from "@laceanatomy/cardano-provider-dbsync";
import assert from "assert";
import pg from "pg";
import { NETWORK, type Network } from "~/app/_utils/network-config";
import { getNetworkConfigServer } from "./server-network-config";

const poolCache: Map<Network, pg.Pool> = new Map();

function getPool(chain: Network): pg.Pool {
  assert(chain !== NETWORK.DEVNET, "Should not get a pool for Devnet");
  const { dbSyncConnectionString } = getNetworkConfigServer(chain);
  const cached = poolCache.get(chain);
  if (cached) return cached;

  if (!dbSyncConnectionString) {
    throw new Error(`No connection string configured for chain: ${chain}`);
  }

  const pool = new pg.Pool({
    connectionString: dbSyncConnectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  poolCache.set(chain, pool);
  return pool;
}

export function getDbSyncProvider(chain: Network): DbSyncProvider {
  assert(chain !== NETWORK.DEVNET, "Should not get Db Sync for Devnet");
  const { addressPrefix, nodeUrl, networkMagic } = getNetworkConfigServer(chain);
  const pool = getPool(chain);

  assert(nodeUrl, "Node URL is required");
  assert(networkMagic, "Network magic is required");

  return new DbSyncProvider({
    pool,
    addrPrefix: addressPrefix,
    nodeUrl: nodeUrl,
    magic: networkMagic,
  });
}
