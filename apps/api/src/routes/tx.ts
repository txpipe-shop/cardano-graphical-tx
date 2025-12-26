import type { FastifyInstance } from 'fastify';
import { Hash } from '@alexandria/types';

export async function txRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/tx/latest
   * Returns the latest transaction
   * Query params:
   */
  fastify.get('/tx/latest', async (request, reply) => {
    try {
      const { maxFetch } = request.query as { maxFetch?: string };

      const tx = await fastify.dbSyncProvider.getLatestTx({
        maxFetch: maxFetch ? parseInt(maxFetch, 10) : 10
      });

      return serializeTx(tx);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Failed to fetch latest transaction',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/tx/:hash
   * Returns a specific transaction by hash
   */
  fastify.get('/tx/:hash', async (request, reply) => {
    try {
      const { hash } = request.params as { hash: string };

      const tx = await fastify.dbSyncProvider.getTx({ hash: Hash(hash) });

      return serializeTx(tx);
    } catch (error) {
      fastify.log.error(error);

      if (error instanceof Error && error.message.includes('not found')) {
        reply.status(404).send({
          error: 'Transaction not found',
          message: error.message
        });
      } else {
        reply.status(500).send({
          error: 'Failed to fetch transaction',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  });

  /**
   * GET /api/tx/:hash/cbor
   * Returns the CBOR representation of a transaction
   */
  fastify.get('/tx/:hash/cbor', async (request, reply) => {
    try {
      const { hash } = request.params as { hash: string };

      const cbor = await fastify.dbSyncProvider.getCBOR({ hash: Hash(hash) });

      return { cbor };
    } catch (error) {
      fastify.log.error(error);

      if (error instanceof Error && error.message.includes('not found')) {
        reply.status(404).send({
          error: 'Transaction CBOR not found',
          message: error.message
        });
      } else {
        reply.status(500).send({
          error: 'Failed to fetch transaction CBOR',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  });

  /**
   * GET /api/txs
   * Returns a list of transactions before a specific transaction hash
   * Query params:
   *   - before: Transaction hash to fetch transactions before
   *   - limit: Maximum number of transactions to return (optional, default: 10)
   */
  fastify.get('/txs', async (request, reply) => {
    try {
      const { before, limit } = request.query as { before?: string; limit?: string };

      if (!before) {
        reply.status(400).send({
          error: 'Missing required parameter',
          message: 'The "before" query parameter is required'
        });
        return;
      }

      const txs = await fastify.dbSyncProvider.getTxs({
        before: Hash(before),
        limit: limit ? parseInt(limit, 10) : 10
      });

      return txs.map(serializeTx);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Failed to fetch transactions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

/**
 * Helper function to serialize transaction objects for JSON response
 * Converts BigInt values to strings for JSON compatibility
 */
function serializeTx(tx: any): any {
  return {
    ...tx,
    blockNo: tx.blockNo?.toString(),
    slot: tx.slot?.toString(),
    size: tx.size?.toString(),
    fee: tx.fee?.toString(),
    inputs: tx.inputs?.map((input: any) => ({
      ...input,
      value: input.value?.toString()
    })),
    outputs: tx.outputs?.map((output: any) => ({
      ...output,
      value: output.value?.toString()
    }))
  };
}
