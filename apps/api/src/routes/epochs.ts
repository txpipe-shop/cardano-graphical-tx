import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema, LimitSchema, OffsetSchema } from '../schemas/common.js';
import { EpochsResponseSchema, EpochSchema } from '../schemas/models.js';

export async function epochsRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/epochs',
    tags: ['Epochs'],
    summary: 'List epochs',
    description: 'Get paginated list of epochs',
    request: {
      query: z.object({
        network: NetworkSchema,
        limit: LimitSchema,
        offset: OffsetSchema
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: EpochsResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/epochs', async (request, reply) => {
    return {
      epochs: [
        {
          number: 42,
          start_time: '2024-01-01T00:00:00Z',
          end_time: '2024-01-05T00:00:00Z',
          tx_count: 5000,
          output: '1000000',
          fees: '5000'
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/epochs/{number}',
    tags: ['Epochs'],
    summary: 'Get epoch details',
    description: 'Get detailed information about a specific epoch',
    request: {
      params: z.object({
        number: z
          .string()
          .regex(/^[0-9]+$/)
          .transform(Number)
          .describe('Epoch number')
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
            schema: EpochSchema
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/epochs/:number', async (request, reply) => {
    return {
      number: 42,
      start_time: '2024-01-01T00:00:00Z',
      end_time: '2024-01-05T00:00:00Z',
      tx_count: 5000,
      output: '1000000',
      fees: '5000'
    };
  });
}
