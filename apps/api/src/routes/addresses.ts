import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';

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
    (request, _reply) => {
      const { address } = addressParamSchema.parse(request.params);
      return {
        address: address,
        balance_ada: 0,
        tx_count: 0,
        transactions: [],
        tokens: []
      };
    }
  );
}
