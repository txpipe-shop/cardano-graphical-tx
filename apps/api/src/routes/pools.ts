import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { getNetworkConfig } from '../utils';
import { getPool, listPools } from '../controllers/pools';

const poolsQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional()
});

const poolParamSchema = z.object({
  id: z.string()
});

const poolQuerySchema = z.object({
  network: schemas.NetworkSchema
});

export function poolsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/pools',
    {
      schema: {
        tags: ['Pools'],
        querystring: poolsQuerySchema,
        response: {
          200: schemas.PoolsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { network, limit, offset, search } = poolsQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);
      return listPools(limit, offset, search, config);
    }
  );

  server.get(
    '/pools/:id',
    {
      schema: {
        tags: ['Pools'],
        params: poolParamSchema,
        querystring: poolQuerySchema,
        response: {
          200: z.object({
            pool: schemas.PoolSchema
          })
        }
      }
    },
    async (request, _reply) => {
      const { id } = poolParamSchema.parse(request.params);
      const { network } = poolQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);
      return getPool(id, config);
    }
  );
}
