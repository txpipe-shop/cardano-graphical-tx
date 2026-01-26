import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import type { Address as AddressRes } from '../types';
import { resolveAddress } from '../controllers/addresses';
import { getNetworkConfig } from '../utils';

const addressParamSchema = z.object({
  address: z.string()
});

const addressQuerySchema = z.object({
  network: schemas.NetworkSchema
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

      const addressResponse: AddressRes = await resolveAddress(
        rawAddress,
        config.pool,
        config.magic,
        config.nodeUrl,
        config.addressPrefix
      );
      return addressResponse;
    }
  );
}
