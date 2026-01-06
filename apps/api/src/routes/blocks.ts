import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema, LimitSchema, OffsetSchema } from '../schemas/common.js';
import { BlocksResponseSchema, BlockSchema } from '../schemas/models.js';

export async function blocksRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/blocks',
    tags: ['Blocks'],
    summary: 'List blocks',
    description: 'Get paginated list of blocks',
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
            schema: BlocksResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/blocks', async (request, reply) => {
    // Mock data
    return {
      blocks: [
        {
          height: 12345,
          hash: 'a1b2c3d4e5f6...',
          slot: 12345678,
          epoch: 42,
          tx_count: 15,
          timestamp: '2024-01-15T10:30:00Z',
          confirmations: 100
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/blocks/latest',
    tags: ['Blocks'],
    summary: 'Get latest blocks',
    description: 'Get the most recent blocks',
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
            schema: z.array(BlockSchema)
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/blocks/latest', async (request, reply) => {
    return [
      {
        height: 5678,
        hash: '0x1234567890abcdef...',
        gas_used: 15000000,
        gas_limit: 30000000,
        tx_count: 120,
        timestamp: '2024-01-15T10:30:00Z',
        confirmations: 50
      }
    ];
  });

  registry.registerPath({
    method: 'get',
    path: '/blocks/{identifier}',
    tags: ['Blocks'],
    summary: 'Get block details',
    description: 'Get detailed information about a specific block by height or hash',
    request: {
      params: z.object({
        identifier: z
          .union([
            z.string(),
            z
              .string()
              .regex(/^[0-9]+$/)
              .transform(Number)
          ])
          .describe('Block height or hash')
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
            schema: BlockSchema
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/blocks/:identifier', async (request, reply) => {
    return {
      height: 12345,
      hash: 'a1b2c3d4e5f6...',
      slot: 12345678,
      epoch: 42,
      tx_count: 15,
      timestamp: '2024-01-15T10:30:00Z',
      confirmations: 100
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/blocks/{identifier}/transactions',
    tags: ['Blocks', 'Transactions'],
    summary: 'Get block transactions',
    description: 'Get all transactions in a specific block',
    request: {
      params: z.object({
        identifier: z
          .union([
            z.string(),
            z
              .string()
              .regex(/^[0-9]+$/)
              .transform(Number)
          ])
          .describe('Block height or hash')
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
              transactions: z.array(z.any()) // Using any here to simplify as Transaction is already defined elsewhere but circular deps might be annoyed if I import strictly, keeping it loose for now or relying on simple Ref if possible manually, but Zod schema reuse is better. I will use z.any() for simplicity in this specific sub-field or import TransactionSchema if I can.
            })
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/blocks/:identifier/transactions', async (request, reply) => {
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
}
