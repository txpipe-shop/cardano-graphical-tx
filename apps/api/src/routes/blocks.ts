import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { BlocksResponse } from '../types';
import { listBlocks, resolveBlock, resolveBlockTxs } from '../controllers/blocks';
import { getNetworkConfig } from '../utils';

export const listBlocksQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

const blocksIdParamsSchema = z.object({
  identifier: z.union([z.string(), z.coerce.number()])
});

const blocksIdQuerySchema = z.object({ network: schemas.NetworkSchema });

const blocksIdParamsTxsSchema = blocksIdParamsSchema;

const blocksTxsResponseSchema = z.object({
  transactions: z.array(schemas.TransactionSchema)
});
const blocksTxsQuerySchema = blocksIdQuerySchema;

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
      const { network, limit, offset } = listBlocksQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);
      const timeAgo = server.timeAgo;

      const blocks: BlocksResponse = await listBlocks(
        BigInt(limit),
        BigInt(offset),
        config.pool,
        timeAgo,
        config.magic,
        config.nodeUrl,
        config.addressPrefix
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
        config.pool,
        timeAgo,
        config.magic,
        config.nodeUrl,
        config.addressPrefix
      );

      return block;
    }
  );

  server.get(
    '/blocks/:identifier/transactions',
    {
      schema: {
        tags: ['Blocks', 'Transactions'],
        params: blocksIdParamsTxsSchema,
        querystring: blocksTxsQuerySchema,
        response: {
          200: blocksTxsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { identifier } = blocksIdParamsSchema.parse(request.params);
      const { network } = blocksTxsQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      // TODO: add proper pagination here
      const blockTxs: z.infer<typeof blocksTxsResponseSchema> = await resolveBlockTxs(
        identifier,
        100n,
        0n,
        config.pool,
        config.magic,
        config.nodeUrl,
        config.addressPrefix
      );

      return blockTxs;
    }
  );
}
