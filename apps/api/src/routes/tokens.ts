import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

export async function tokensRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/tokens',
    {
      schema: {
        tags: ['Tokens'],
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0)
        }),
        response: {
          200: schemas.TokensResponseSchema
        }
      }
    },
    async (request, reply) => {
      return {
        tokens: [],
        pagination: {
          total: 0,
          limit: request.query.limit,
          offset: request.query.offset,
          hasMore: false
        }
      };
    }
  );

  server.get(
    '/tokens/:identifier',
    {
      schema: {
        tags: ['Tokens'],
        params: z.object({
          identifier: z.string()
        }),
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.TokenSchema
        }
      }
    },
    async (request, reply) => {
      return {
        name: 'Mock Token',
        symbol: 'MTK',
        decimals: 18,
        total_supply: '0',
        total_supply_formatted: '0'
      };
    }
  );

  server.get(
    '/tokens/:identifier/holders',
    {
      schema: {
        tags: ['Tokens'],
        params: z.object({
          identifier: z.string()
        }),
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0)
        }),
        response: {
          200: schemas.TokenHoldersResponseSchema
        }
      }
    },
    async (request, reply) => {
      return {
        holders: [],
        pagination: {
          total: 0,
          limit: request.query.limit,
          offset: request.query.offset,
          hasMore: false
        }
      };
    }
  );

  server.get(
    '/tokens/:identifier/transfers',
    {
      schema: {
        tags: ['Tokens'],
        params: z.object({
          identifier: z.string()
        }),
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0)
        }),
        response: {
          200: schemas.TokenTransfersResponseSchema
        }
      }
    },
    async (request, reply) => {
      return {
        transfers: [],
        pagination: {
          total: 0,
          limit: request.query.limit,
          offset: request.query.offset,
          hasMore: false
        }
      };
    }
  );

  server.get(
    '/token-transfers',
    {
      schema: {
        tags: ['Tokens'],
        querystring: z.object({
          network: schemas.NetworkSchema,
          limit: z.coerce.number().min(1).max(100).default(20),
          offset: z.coerce.number().min(0).default(0),
          token: z.string().optional()
        }),
        response: {
          200: schemas.TokenTransfersResponseSchema
        }
      }
    },
    async (request, reply) => {
      return {
        transfers: [],
        pagination: {
          total: 0,
          limit: request.query.limit,
          offset: request.query.offset,
          hasMore: false
        }
      };
    }
  );
}
