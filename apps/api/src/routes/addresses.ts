import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema } from '../schemas/common.js';
import { AddressSchema } from '../schemas/models.js';

export async function addressRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/addresses/{address}',
    tags: ['Addresses'],
    summary: 'Get address details',
    description: 'Get detailed information about an address',
    request: {
      params: z.object({
        address: z.string().describe('Address')
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
            schema: AddressSchema
          }
        }
      },
      404: { $ref: '#/components/responses/NotFound' },
      400: { $ref: '#/components/responses/BadRequest' },
      500: { $ref: '#/components/responses/InternalServerError' }
    }
  });

  fastify.get('/addresses/:address', async (request, reply) => {
    return {
      address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj...',
      balance: '1000000000',
      tx_count: 50,
      tokens: [
        {
          policy: 'a1b2...',
          name: 'TestToken',
          amount: '1000'
        }
      ]
    };
  });
}
