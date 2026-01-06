import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema } from '../schemas/common.js';
import { PriceSchema, ChartDataSchema } from '../schemas/models.js';

export async function utilityRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/price/ap3x',
    tags: ['Utility'],
    summary: 'Get AP3X price',
    description: 'Get current AP3X token price',
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
            schema: PriceSchema
          }
        }
      },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/price/ap3x', async (request, reply) => {
    return {
      price: 1.5,
      currency: 'USD',
      timestamp: '2024-01-15T10:30:00Z'
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/health',
    tags: ['Utility'],
    summary: 'Health check',
    description: 'Check API health status',
    responses: {
      200: {
        description: 'API is healthy',
        content: {
          'application/json': {
            schema: z.object({
              status: z.string().openapi({ example: 'ok' }),
              timestamp: z.string().datetime().openapi({ example: '2024-01-15T10:30:00Z' })
            })
          }
        }
      }
    }
  });

  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/chart',
    tags: ['Utility'],
    summary: 'Get chart data',
    description: 'Get historical data for charts',
    request: {
      query: z.object({
        network: NetworkSchema,
        range: z.enum(['24h', '1w', '2w', '1m']).default('24h').describe('Time range')
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: ChartDataSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/chart', async (request, reply) => {
    return [
      { time: '10:00', value: 100 },
      { time: '11:00', value: 120 }
    ];
  });
}
