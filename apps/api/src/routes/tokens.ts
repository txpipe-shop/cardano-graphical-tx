import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema, LimitSchema, OffsetSchema } from '../schemas/common.js';
import {
  TokensResponseSchema,
  TokenSchema,
  TokenHoldersResponseSchema,
  TokenTransfersResponseSchema
} from '../schemas/models.js';

export async function tokensRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/tokens',
    tags: ['Tokens'],
    summary: 'List tokens',
    description: 'Get paginated list of tokens',
    request: {
      query: z.object({
        network: NetworkSchema,
        limit: LimitSchema,
        offset: OffsetSchema
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: TokensResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/tokens', async (request, reply) => {
    return {
      tokens: [
        {
          identifier: 'a1b2...',
          name: 'TestToken',
          ticker: 'TST',
          total_supply: '1000000'
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/tokens/{identifier}',
    tags: ['Tokens'],
    summary: 'Get token details',
    description: 'Get detailed information about a specific token',
    request: {
      params: z.object({
        identifier: z.string().describe('Token identifier')
      }),
      query: z.object({
        network: NetworkSchema
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: TokenSchema
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/tokens/:identifier', async (request, reply) => {
    return {
      identifier: 'a1b2c3d4e5f6...',
      name: 'TestToken',
      ticker: 'TST',
      total_supply: '1000000'
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/tokens/{identifier}/holders',
    tags: ['Tokens'],
    summary: 'Get token holders',
    description: 'Get paginated list of token holders',
    request: {
      params: z.object({
        identifier: z.string().describe('Token identifier')
      }),
      query: z.object({
        network: NetworkSchema,
        limit: LimitSchema,
        offset: OffsetSchema
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: TokenHoldersResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/tokens/:identifier/holders', async (request, reply) => {
    return {
      holders: [
        {
          address: '0x123...',
          amount: '100'
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/tokens/{identifier}/transfers',
    tags: ['Tokens'],
    summary: 'Get token transfers',
    description: 'Get paginated list of token transfers for a specific token',
    request: {
      params: z.object({
        identifier: z.string().describe('Token identifier')
      }),
      query: z.object({
        network: NetworkSchema,
        limit: LimitSchema,
        offset: OffsetSchema
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: TokenTransfersResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/tokens/:identifier/transfers', async (request, reply) => {
    return {
      transfers: [
        {
          tx_hash: '0xabc...',
          from_address: '0x123...',
          to_address: '0x456...',
          amount: '50',
          timestamp: '2024-01-15T10:30:00Z'
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/token-transfers',
    tags: ['Tokens'],
    summary: 'List all token transfers',
    description: 'Get paginated list of all token transfers',
    request: {
      query: z.object({
        network: NetworkSchema,
        limit: LimitSchema,
        offset: OffsetSchema,
        token: z.string().optional().describe('Filter by token contract address')
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: TokenTransfersResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/token-transfers', async (request, reply) => {
    return {
      transfers: [
        {
          tx_hash: '0xabc...',
          from_address: '0x123...',
          to_address: '0x456...',
          amount: '50',
          timestamp: '2024-01-15T10:30:00Z'
        }
      ]
    };
  });
}
