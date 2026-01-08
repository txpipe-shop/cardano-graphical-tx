import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export function gasRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/gas',
    {
      schema: {
        tags: ['Gas'],
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.GasEstimateSchema
        }
      }
    },
    (_request, _reply) => {
      return {
        slow: { gwei: 1.0, dfm: 0.000000001, time: '~5 min' },
        standard: { gwei: 2.0, dfm: 0.000000002, time: '~2 min' },
        fast: { gwei: 3.0, dfm: 0.000000003, time: '~30 sec' },
        instant: { gwei: 5.0, dfm: 0.000000005, time: '~15 sec' }
      };
    }
  );
}
