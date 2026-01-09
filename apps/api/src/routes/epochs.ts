import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { listEpochs } from '../controllers/epochs';
import { EpochsResponse } from '../types';

const epochsListQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

export function epochsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/epochs',
    {
      schema: {
        tags: ['Epochs'],
        querystring: epochsListQuerySchema,
        response: {
          200: schemas.EpochsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { limit, offset } = epochsListQuerySchema.parse(request.query);
      const pool = server.pg;

      const epochsListRes: EpochsResponse = await listEpochs(BigInt(limit), BigInt(offset), pool);

      return epochsListRes;
    }
  );

  server.get(
    '/epochs/:number',
    {
      schema: {
        tags: ['Epochs'],
        params: z.object({
          number: z.coerce.number().min(0)
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.EpochSchema
        }
      }
    },
    async (request, _reply) => {
      return {
        epoch: request.params.number,
        start_slot: 0,
        end_slot: 0,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        start_height: 0,
        end_height: 0
      };
    }
  );
}
