import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registry } from '../openapi.js';
import { NetworkSchema } from '../schemas/common.js';
import { AddressSchema } from '../schemas/models.js';
import { Address, assetNameFromUnit, policyFromUnit, Unit } from '@alexandria/types';
import { DbSyncProvider } from '@alexandria/cardano-provider-dbsync';
import { networkToAddrPrefix, normalizeAddress } from '../utils.js';

const AddressReqParams = z.object({
  address: z.string().describe('Address')
});

const AddressReqQuery = z.object({
  network: NetworkSchema
});

export async function addressRoutes(fastify: FastifyInstance) {
  registry.registerPath({
    method: 'get',
    path: '/addresses/{address}',
    tags: ['Addresses'],
    summary: 'Get address details',
    description: 'Get detailed information about an address',
    request: {
      params: AddressReqParams,
      query: AddressReqQuery
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
    const pool = fastify.pgPool;

    const { address: rawAddress } = AddressReqParams.parse(request.params);
    const { network } = AddressReqQuery.parse(request.query);

    const address = Address(rawAddress);
    const addrPrefix = networkToAddrPrefix(network);

    const provider = new DbSyncProvider({ pool, addrPrefix });

    const { txCount, value } = await provider.getAddressFunds({ address });
    const tokens: z.infer<typeof AddressSchema>['tokens'] = [];
    for (const [unit, amount] of Object.entries(value)) {
      tokens.push({
        amount: amount.toString(),
        name: assetNameFromUnit(unit as Unit),
        policy: policyFromUnit(unit as Unit)
      });
    }
    const coin = value[Unit('lovelace')].toString();
    const normalizedAddr = normalizeAddress(address, addrPrefix);

    const response: z.infer<typeof AddressSchema> = {
      address: normalizedAddr,
      balance: coin,
      tokens,
      tx_count: Number(txCount)
    };
    return response;
  });
}
