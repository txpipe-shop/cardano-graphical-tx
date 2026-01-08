import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export async function statsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/stats',
    {
      schema: {
        tags: ['Stats'],
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.StatsSchema
        }
      }
    },
    async (request, reply) => {
      return {
        blockHeight: '0',
        transactions: '0',
        addresses: '0',
        avgBlockTime: '0s'
      };
    }
  );
}
