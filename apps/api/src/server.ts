import Fastify from 'fastify';
import cors from '@fastify/cors';
import pg from 'pg';
import { config } from './config.js';
import { registerRoutes } from './routes/index.js';

const { Pool } = pg;

declare module 'fastify' {
  interface FastifyInstance {
    pgPool: import('pg').Pool;
  }
}

export async function buildServer() {
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

  try {
    const client = await pool.connect();
    client.release();
    console.log('✓ Database connection established');
  } catch (error) {
    console.error('✗ Failed to connect to database:', error);
    throw error;
  }

  const fastify = Fastify({
    logger: {
      level: config.server.logLevel
    },
    maxParamLength: 512
  });

  fastify.decorate('pgPool', pool);
  await fastify.register(cors, { origin: true });

  registerRoutes(fastify);

  fastify.ready().then(() => {
    console.log('Registered routes:\n' + fastify.printRoutes());
  });

  const closeGracefully = async (signal: string) => {
    console.log(`\nReceived signal to terminate: ${signal}`);
    await fastify.close();
    process.exit(0);
  };

  process.on('SIGINT', () => closeGracefully('SIGINT'));
  process.on('SIGTERM', () => closeGracefully('SIGTERM'));

  return fastify;
}
