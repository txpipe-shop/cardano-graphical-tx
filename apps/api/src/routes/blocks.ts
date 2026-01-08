import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export function blocksRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/blocks',
    {
      schema: {
        tags: ['Blocks'],
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0)
        }),
        response: {
          200: schemas.BlocksResponseSchema
        }
      }
    },
    async (request, _reply) => {
      // Mock response
      return {
        blocks: [],
        pagination: {
          total: 0,
          limit: request.query.limit,
          offset: request.query.offset,
          hasMore: false
        }
      };
    }
  );

  server.get(
    '/blocks/latest',
    {
      schema: {
        tags: ['Blocks'],
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: z.array(schemas.BlockSchema)
        }
      }
    },
    async (_request, _reply) => {
      return [];
    }
  );

  server.get(
    '/blocks/:identifier',
    {
      schema: {
        tags: ['Blocks'],
        params: z.object({
          identifier: z.union([z.string(), z.coerce.number()])
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.BlockSchema
        }
      }
    },
    async (_request, _reply) => {
      // Mock response
      return {
        height: 12345,
        hash: '0x123',
        tx_count: 0,
        timestamp: new Date().toISOString()
      };
    }
  );

  server.get(
    '/blocks/:identifier/transactions',
    {
      schema: {
        tags: ['Blocks', 'Transactions'],
        params: z.object({
          identifier: z.union([z.string(), z.coerce.number()])
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: z.object({
            transactions: z.array(schemas.TransactionSchema)
          })
        }
      }
    },
    async (_request, _reply) => {
      return { transactions: [] };
    }
  );
}
