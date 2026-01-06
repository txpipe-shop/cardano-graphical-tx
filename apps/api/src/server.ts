import Fastify from 'fastify';
import cors from '@fastify/cors';
import { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';
import pg from 'pg';
import { config } from './config.js';
import { registerRoutes } from './routes/index.js';

const { Pool } = pg;

export async function buildServer() {
  // Create PostgreSQL connection pool
  const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });

  // Test database connection
  try {
    const client = await pool.connect();
    client.release();
    console.log('✓ Database connection established');
  } catch (error) {
    console.error('✗ Failed to connect to database:', error);
    throw error;
  }

  // Initialize DbSync provider
  const dbSyncProvider = new DbSyncProvider({ pool });

  // Create Fastify instance
  const fastify = Fastify({
    logger: {
      level: config.server.logLevel
    }
  });

  // Register CORS
  await fastify.register(cors, {
    origin: true // Allow all origins in development
  });

  // Make provider available to routes
  fastify.decorate('dbSyncProvider', dbSyncProvider);

  // Register routes
  registerRoutes(fastify);

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Graceful shutdown
  const closeGracefully = async (signal: string) => {
    console.log(`\nReceived signal to terminate: ${signal}`);
    await fastify.close();
    await dbSyncProvider.close();
    process.exit(0);
  };

  process.on('SIGINT', () => closeGracefully('SIGINT'));
  process.on('SIGTERM', () => closeGracefully('SIGTERM'));

  return fastify;
}
