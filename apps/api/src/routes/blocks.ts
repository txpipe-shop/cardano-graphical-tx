import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';
import { BlocksResponse } from '../types';

const blockQuerySchema = z.object({
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
        querystring: blockQuerySchema,
        response: {
          200: schemas.BlocksResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { limit, offset } = blockQuerySchema.parse(request.query);
      const pool = server.pg;
      const timeAgo = server.timeAgo;

      const provider = new DbSyncProvider({ pool, addrPrefix: 'addr' });

      const { data: blocks, total } = await provider.getBlocks({
        limit: BigInt(limit),
        offset: BigInt(offset),
        query: undefined
      });

      const blocksRes: BlocksResponse['blocks'] = blocks.map((block) => {
        const date = new Date(block.time * 1000);
        return {
          hash: block.hash,
          height: Number(block.height),
          slot: Number(block.slot),
          timestamp: date.toISOString(),
          time: timeAgo.format(date),
          tx_count: Number(block.txCount),
          confirmations:
            block.confirmations !== undefined ? Number(block.confirmations) : undefined,
          // TODO: add (not sure if it's in the UI)
          epoch: null,
          // TODO: add  (not sure if it's in the UI)
          size: null,
          // EVM fields
          base_fee_per_gas: undefined,
          gas_limit: undefined,
          gas_used: undefined
        };
      });

      const res: BlocksResponse = {
        blocks: blocksRes,
        pagination: {
          total: Number(total),
          limit: request.query.limit,
          offset: request.query.offset,
          hasMore: BigInt(offset + limit) < total
        }
      };
      return res;
    }
  );

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
        params: z.object({
          identifier: z.union([z.string(), z.coerce.number()])
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.BlockSchema
        }
      }
    },
    async (_request, _reply) => {
      // Mock response
      return {
        height: 12345,
        hash: '0x123',
        tx_count: 0,
        timestamp: new Date().toISOString()
      };
    }
  );

  server.get(
    '/blocks/:identifier/transactions',
    {
      schema: {
        tags: ['Blocks', 'Transactions'],
        params: z.object({
          identifier: z.union([z.string(), z.coerce.number()])
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: z.object({
            transactions: z.array(schemas.TransactionSchema)
          })
        }
      }
    },
    async (_request, _reply) => {
      return { transactions: [] };
    }
  );
}
