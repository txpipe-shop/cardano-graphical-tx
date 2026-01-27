import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import type {
  Address as AddressRes,
  AddressTransactionsResponse,
  AddressUtxosResponse
} from '../types';
import {
  resolveAddress,
  listAddressTransactions,
  listAddressUtxos
} from '../controllers/addresses';
import { getNetworkConfig } from '../utils';

const addressParamSchema = z.object({
  address: z.string()
});

const addressQuerySchema = z.object({
  network: schemas.NetworkSchema
});

const addressPaginatedQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

export function addressesRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/addresses/:address',
    {
      schema: {
        tags: ['Addresses'],
        params: addressParamSchema,
        querystring: addressQuerySchema,
        response: {
          200: schemas.AddressSchema
        }
      }
    },
    async (request, _reply) => {
      const { address: rawAddress } = addressParamSchema.parse(request.params);
      const { network } = addressQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const addressResponse: AddressRes = await resolveAddress(rawAddress, config);
      return addressResponse;
    }
  );

  server.get(
    '/addresses/:address/transactions',
    {
      schema: {
        tags: ['Addresses'],
        params: addressParamSchema,
        querystring: addressPaginatedQuerySchema,
        response: {
          200: schemas.AddressTransactionsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { address: rawAddress } = addressParamSchema.parse(request.params);
      const { network, limit, offset } = addressPaginatedQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const result: AddressTransactionsResponse = await listAddressTransactions(
        rawAddress,
        BigInt(limit),
        BigInt(offset),
        config
      );
      return result;
    }
  );

  server.get(
    '/addresses/:address/utxos',
    {
      schema: {
        tags: ['Addresses'],
        params: addressParamSchema,
        querystring: addressPaginatedQuerySchema,
        response: {
          200: schemas.AddressUtxosResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { address: rawAddress } = addressParamSchema.parse(request.params);
      const { network, limit, offset } = addressPaginatedQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const result: AddressUtxosResponse = await listAddressUtxos(
        rawAddress,
        BigInt(limit),
        BigInt(offset),
        config
      );
      return result;
    }
  );
}
