import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema, LimitSchema, OffsetSchema } from '../schemas/common.js';
import { TransactionsResponseSchema, TransactionSchema } from '../schemas/models.js';

export async function transactionsRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/transactions',
    tags: ['Transactions'],
    summary: 'List transactions',
    description: 'Get paginated list of transactions',
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
            schema: TransactionsResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/transactions', async (request, reply) => {
    return {
      transactions: [
        {
          hash: 'a1b2c3d4e5f6...',
          block_height: 12345,
          block_hash: 'a1b2c3d4e5f6...',
          timestamp: '2024-01-15T10:30:00Z',
          fee: '150000',
          size: 350,
          status: 'success',
          inputs: [],
          outputs: []
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/transactions/latest',
    tags: ['Transactions'],
    summary: 'Get latest transactions',
    description: 'Get the most recent transactions',
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
            schema: z.array(TransactionSchema)
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/transactions/latest', async (request, reply) => {
    return [
      {
        hash: 'a1b2c3d4e5f6...',
        block_height: 12345,
        block_hash: 'a1b2c3d4e5f6...',
        timestamp: '2024-01-15T10:30:00Z',
        fee: '150000',
        size: 350,
        status: 'success',
        inputs: [],
        outputs: []
      }
    ];
  });

  registry.registerPath({
    method: 'get',
    path: '/transactions/{hash}',
    tags: ['Transactions'],
    summary: 'Get transaction details',
    description: 'Get detailed information about a specific transaction',
    request: {
      params: z.object({
        hash: z.string().describe('Transaction hash')
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
            schema: TransactionSchema
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/transactions/:hash', async (request, reply) => {
    return {
      hash: 'a1b2c3d4e5f6...',
      block_height: 12345,
      block_hash: 'a1b2c3d4e5f6...',
      timestamp: '2024-01-15T10:30:00Z',
      fee: '150000',
      size: 350,
      status: 'success',
      inputs: [],
      outputs: []
    };
  });
}
