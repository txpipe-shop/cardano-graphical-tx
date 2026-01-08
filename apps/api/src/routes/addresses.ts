import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import type { Address as AddressRes } from '../types';
import { resolveAddress } from '../controllers/addresses';

const addressParamSchema = z.object({
  address: z.string()
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
}
