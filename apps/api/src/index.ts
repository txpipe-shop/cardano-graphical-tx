import { buildServer } from './server.js';
import { config } from './config.js';

async function start() {
    try {
        const server = await buildServer();

        await server.listen({
            port: config.server.port,
            host: config.server.host,
        });

        console.log(`
╔════════════════════════════════════════════════════════╗
║  Alexandria API Server                                 ║
║  Status: Running ✓                                     ║
║  Port: ${config.server.port.toString().padEnd(47)}║
║  Host: ${config.server.host.padEnd(47)}║
║  Database: ${config.db.database.padEnd(43)}║
╚════════════════════════════════════════════════════════╝

Available endpoints:
  GET  /health           - Health check
  GET  /api/tip          - Get current chain tip
  GET  /api/tx/latest    - Get latest transaction
  GET  /api/tx/:hash     - Get transaction by hash
  GET  /api/tx/:hash/cbor - Get transaction CBOR
  GET  /api/txs          - Get transactions before slot
`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();
