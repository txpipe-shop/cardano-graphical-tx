import type { FastifyInstance } from 'fastify';
import type { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';

declare module 'fastify' {
    interface FastifyInstance {
        dbSyncProvider: DbSyncProvider;
    }
}

export async function tipRoutes(fastify: FastifyInstance) {
    /**
     * GET /api/tip
     * Returns the current chain tip (latest block hash and slot)
     */
    fastify.get('/tip', async (request, reply) => {
        try {
            const tip = await fastify.dbSyncProvider.readTip();

            return {
                hash: tip.hash,
                slot: tip.slot.toString(), // Convert BigInt to string for JSON serialization
            };
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({
                error: 'Failed to read chain tip',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
}
