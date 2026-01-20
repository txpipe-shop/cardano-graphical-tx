import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import type { Address as AddressRes, TransactionsResponse, UTxOsResponse } from '../types';
import { resolveAddress, resolveAddressTxs, resolveAddressUTxOs } from '../controllers/addresses';

const addressParamSchema = z.object({
  address: z.string()
});

export const paginatedQuerySchema = z.object({
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
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: schemas.AddressSchema
        }
      }
    },
    async (request, _reply) => {
      const { address: rawAddress } = addressParamSchema.parse(request.params);
      const pool = server.pg;

      const addressResponse: AddressRes = await resolveAddress(rawAddress, pool);
      return addressResponse;
    }
  );

  server.get(
    '/addresses/:address/transactions',
    {
      schema: {
        tags: ['Addresses', 'Transactions'],
        params: addressParamSchema,
        queryString: paginatedQuerySchema,
        response: {
          200: schemas.TransactionsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { address } = addressParamSchema.parse(request.params);
      const { limit, network: _, offset } = paginatedQuerySchema.parse(request.query);
      const pool = server.pg;

      const txs: TransactionsResponse = await resolveAddressTxs(
        address,
        BigInt(offset),
        BigInt(limit),
        pool
      );

      return txs;
    }
  );

  server.get(
    '/addresses/:address/utxos',
    {
      schema: {
        tags: ['Addresses', 'UTxOs'],
        params: addressParamSchema,
        queryString: paginatedQuerySchema,
        response: {
          200: schemas.UTxOsReponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { address } = addressParamSchema.parse(request.params);
      const { limit, network: _, offset } = paginatedQuerySchema.parse(request.query);
      const pool = server.pg;

      const utxos: UTxOsResponse = await resolveAddressUTxOs(
        address,
        BigInt(offset),
        BigInt(limit),
        pool
      );

      return utxos;
    }
  );
}
