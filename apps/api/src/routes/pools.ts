import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema, LimitSchema, OffsetSchema } from '../schemas/common.js';
import { PoolsResponseSchema, PoolSchema } from '../schemas/models.js';

export async function poolsRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/pools',
    tags: ['Pools'],
    summary: 'List staking pools',
    description: 'Get paginated list of staking pools',
    request: {
      query: z.object({
        network: NetworkSchema,
        limit: LimitSchema,
        offset: OffsetSchema,
        search: z.string().optional().describe('Search by pool ID, ticker, or name')
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: PoolsResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/pools', async (request, reply) => {
    return {
      pools: [
        {
          id: 'pool1...',
          name: 'Cool Pool',
          ticker: 'COOL',
          pledge: '1000',
          margin: 0.05,
          cost: '340',
          live_stake: '500000',
          blocks_minted: 50
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/pools/{id}',
    tags: ['Pools'],
    summary: 'Get pool details',
    description: 'Get detailed information about a specific staking pool',
    request: {
      params: z.object({
        id: z.string().describe('Pool ID')
      }),
      query: z.object({
        network: NetworkSchema
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: z.object({
              pool: PoolSchema
            })
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/pools/:id', async (request, reply) => {
    return {
      pool: {
        id: 'pool1...',
        name: 'Cool Pool',
        ticker: 'COOL',
        pledge: '1000',
        margin: 0.05,
        cost: '340',
        live_stake: '500000',
        blocks_minted: 50
      }
    };
  });
}
