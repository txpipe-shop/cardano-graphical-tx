import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { BlocksResponse, BlockTxsResponse } from '../types';
import { listBlocks, resolveBlock, resolveBlockTxs } from '../controllers/blocks';
import { getNetworkConfig } from '../utils';

export const listBlocksQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  epoch: z.coerce.number().min(0).optional()
});

const blocksIdParamsSchema = z.object({
  identifier: z.union([z.string(), z.coerce.number()])
});

const blocksIdQuerySchema = z.object({ network: schemas.NetworkSchema });

const blocksTxsQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

export function blocksRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/blocks',
    {
      schema: {
        tags: ['Blocks'],
        querystring: listBlocksQuerySchema,
        response: {
          200: schemas.BlocksResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { network, limit, offset, epoch } = listBlocksQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);
      const timeAgo = server.timeAgo;

      const blocks: BlocksResponse = await listBlocks(
        BigInt(limit),
        BigInt(offset),
        config,
        timeAgo,
        epoch !== undefined ? BigInt(epoch) : undefined
      );

      return blocks;
    }
  );

  // TODO: pointless endpoint (just limit the previous one without offset)
  server.get(
    '/blocks/latest',
    {
      schema: {
        tags: ['Blocks'],
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: z.array(schemas.BlockSchema)
        }
      }
    },
    async (_request, _reply) => {
      return [];
    }
  );

  server.get(
    '/blocks/:identifier',
    {
      schema: {
        tags: ['Blocks'],
        params: blocksIdParamsSchema,
        querystring: blocksIdQuerySchema,
        response: {
          200: schemas.BlockSchema
        }
      }
    },
    async (request, _reply) => {
      const { identifier } = blocksIdParamsSchema.parse(request.params);
      const { network } = blocksIdQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);
      const timeAgo = server.timeAgo;

      const block: z.infer<typeof schemas.BlockSchema> = await resolveBlock(
        identifier,
        config,
        timeAgo
      );

      return block;
    }
  );

  server.get(
    '/blocks/:identifier/transactions',
    {
      schema: {
        tags: ['Blocks', 'Transactions'],
        params: blocksIdParamsSchema,
        querystring: blocksTxsQuerySchema,
        response: {
          200: schemas.BlockTxsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { identifier } = blocksIdParamsSchema.parse(request.params);
      const { network, limit, offset } = blocksTxsQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const blockTxs: BlockTxsResponse = await resolveBlockTxs(
        identifier,
        BigInt(limit),
        BigInt(offset),
        config
      );

      return blockTxs;
    }
  );
}
