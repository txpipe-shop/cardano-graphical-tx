import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema, LimitSchema, OffsetSchema } from '../schemas/common.js';
import { ContractsResponseSchema, ContractSchema } from '../schemas/models.js';

export async function contractsRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/contracts',
    tags: ['Contracts'],
    summary: 'List smart contracts',
    description: 'Get paginated list of verified smart contracts',
    request: {
      query: z.object({
        network: NetworkSchema,
        limit: LimitSchema,
        offset: OffsetSchema,
        search: z.string().optional().describe('Search by contract name or address')
      })
    },
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: ContractsResponseSchema
          }
        }
      },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/contracts', async (request, reply) => {
    return {
      contracts: [
        {
          address: '0xabc...',
          name: 'MyContract',
          verified: true
        }
      ]
    };
  });

  registry.registerPath({
    method: 'get',
    path: '/contracts/{address}',
    tags: ['Contracts'],
    summary: 'Get contract details',
    description: 'Get detailed information about a smart contract',
    request: {
      params: z.object({
        address: z.string().describe('Contract address')
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
            schema: ContractSchema
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/contracts/:address', async (request, reply) => {
    return {
      address: '0xabc...',
      name: 'MyContract',
      verified: true,
      source_code: '// source code'
    };
  });
}
