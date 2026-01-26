import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { resolveStats } from '../controllers/stats';
import { getNetworkConfig } from '../utils';
import { Stats } from '../types';

const statsQuerySchema = z.object({
  network: schemas.NetworkSchema
});

export function statsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/stats',
    {
      schema: {
        tags: ['Stats'],
        querystring: statsQuerySchema,
        response: {
          200: schemas.StatsSchema
        }
      }
    },
    async (request, _reply) => {
      const { network } = statsQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const stats: Stats = await resolveStats(config);
      return stats;
    }
  );
}
