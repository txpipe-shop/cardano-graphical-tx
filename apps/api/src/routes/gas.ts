import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema } from '../schemas/common.js';
import { GasEstimateSchema } from '../schemas/models.js';

export async function gasRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/gas',
    tags: ['Gas'],
    summary: 'Get gas price estimates',
    description: 'Get gas price estimates for different transaction speeds',
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
            schema: GasEstimateSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/gas', async (request, reply) => {
    return {
      slow: '10',
      standard: '15',
      fast: '20',
      timestamp: '2024-01-15T10:30:00Z'
    };
  });
}
