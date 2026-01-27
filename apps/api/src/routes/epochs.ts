import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { resolveEpoch, listEpochs } from '../controllers/epochs';
import { listBlocks } from '../controllers/blocks';
import { Epoch, EpochsResponse, BlocksResponse } from '../types';
import { getNetworkConfig } from '../utils';

const epochsListQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

const epochParamSchema = z.object({
  number: z.coerce.number().min(0)
});

const epochQuerySchema = z.object({
  network: schemas.NetworkSchema
});

const epochBlocksQuerySchema = z.object({
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
      const { network, limit, offset } = epochsListQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const epochsListRes: EpochsResponse = await listEpochs(BigInt(limit), BigInt(offset), config);

      return epochsListRes;
    }
  );

  server.get(
    '/epochs/:number',
    {
      schema: {
        tags: ['Epochs'],
        params: epochParamSchema,
        querystring: epochQuerySchema,
        response: {
          200: schemas.EpochSchema
        }
      }
    },
    async (request, _reply) => {
      const { number: epochNo } = epochParamSchema.parse(request.params);
      const { network } = epochQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const epoch: Epoch = await resolveEpoch(BigInt(epochNo), config);
      return epoch;
    }
  );

  server.get(
    '/epochs/:number/blocks',
    {
      schema: {
        tags: ['Epochs', 'Blocks'],
        params: epochParamSchema,
        querystring: epochBlocksQuerySchema,
        response: {
          200: schemas.BlocksResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { number: epochNo } = epochParamSchema.parse(request.params);
      const { network, limit, offset } = epochBlocksQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);
      const timeAgo = server.timeAgo;

      const blocksRes: BlocksResponse = await listBlocks(
        BigInt(limit),
        BigInt(offset),
        config,
        timeAgo,
        BigInt(epochNo)
      );

      return blocksRes;
    }
  );
}
