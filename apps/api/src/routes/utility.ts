import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export async function utilityRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/price/ap3x',
    {
      schema: {
        tags: ['Utility'],
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.PriceSchema
        }
      }
    },
    async (request, reply) => {
      return {
        price: 0.5
      };
    }
  );

  server.get(
    '/chart',
    {
      schema: {
        tags: ['Utility'],
        querystring: z.object({
          network: schemas.NetworkSchema,
          range: z.enum(['24h', '1w', '2w', '1m']).default('24h')
        }),
        response: {
          200: schemas.ChartDataSchema
        }
      }
    },
    async (request, reply) => {
      return {
        hourly: []
      };
    }
  );
}
