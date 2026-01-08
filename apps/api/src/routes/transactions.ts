import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export function transactionsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/transactions',
    {
      schema: {
        tags: ['Transactions'],
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0)
        }),
        response: {
          200: schemas.TransactionsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      return {
        transactions: [],
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
    '/transactions/latest',
    {
      schema: {
        tags: ['Transactions'],
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: z.array(schemas.TransactionSchema)
        }
      }
    },
    async (_request, _reply) => {
      return [];
    }
  );

  server.get(
    '/transactions/:hash',
    {
      schema: {
        tags: ['Transactions'],
        params: z.object({
          hash: z.string()
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.TransactionSchema
        }
      }
    },
    async (request, _reply) => {
      // Mock response matching schema
      return {
        hash: request.params.hash,
        block_height: 12345,
        status: 'success' as const,
        timestamp: new Date().toISOString()
      };
    }
  );
}
