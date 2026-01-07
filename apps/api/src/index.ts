import { buildServer } from './server.js';
import { config } from './config.js';

async function start() {
  try {
    const server = await buildServer();

    await server.listen({ port: config.server.port, host: config.server.host });

    console.log(`
╔════════════════════════════════════════════════════════╗
║  Alexandria API Server                                 ║
║  Status: Running ✓                                     ║
║  Port: ${config.server.port.toString().padEnd(47)}║
║  Host: ${config.server.host.padEnd(47)}║
║  Database: ${config.db.database.padEnd(43)}║
╚════════════════════════════════════════════════════════╝
`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
