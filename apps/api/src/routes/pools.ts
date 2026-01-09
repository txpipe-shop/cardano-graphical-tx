import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export function poolsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/pools',
    {
      schema: {
        tags: ['Pools'],
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0),
          search: z.string().optional()
        }),
        response: {
          200: schemas.PoolsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      return {
        pools: [],
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
    '/pools/:id',
    {
      schema: {
        tags: ['Pools'],
        params: z.object({
          id: z.string()
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: z.object({
            pool: schemas.PoolSchema
          })
        }
      }
    },
    async (request, _reply) => {
      return {
        pool: {
          poolId: request.params.id,
          hex: request.params.id
        }
      };
    }
  );
}
