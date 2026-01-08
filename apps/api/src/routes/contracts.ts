import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export function contractsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/contracts',
    {
      schema: {
        tags: ['Contracts'],
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0),
          search: z.string().optional()
        }),
        response: {
          200: schemas.ContractsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      return {
        contracts: [],
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
    '/contracts/:address',
    {
      schema: {
        tags: ['Contracts'],
        params: z.object({
          address: z.string()
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.ContractSchema
        }
      }
    },
    async (request, _reply) => {
      return {
        address: request.params.address,
        name: 'Mock Contract',
        verified: false,
        tx_count: 0
      };
    }
  );
}
