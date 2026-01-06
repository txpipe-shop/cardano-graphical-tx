import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema } from '../schemas/common.js';
import { StatsSchema } from '../schemas/models.js';

export async function statsRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/stats',
    tags: ['Stats'],
    summary: 'Get network statistics',
    description: 'Get overall network statistics',
    request: {
      query: z.object({
        network: NetworkSchema
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: StatsSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/stats', async (request, reply) => {
    return {
      network_name: 'prime',
      block_height: 123456,
      tx_count: 500000,
      address_count: 20000,
      circulating_supply: '30000000000',
      epoch: 42
    };
  });
}
