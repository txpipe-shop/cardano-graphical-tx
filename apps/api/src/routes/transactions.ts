import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as schemas from '../schemas';
import { Transaction, TransactionsResponse } from '../types';
import { listTransactions, resolveTx } from '../controllers/transactions';
import { Hash } from '@laceanatomy/types';
import { getNetworkConfig } from '../utils';

const txsQuerySchema = z.object({
  network: schemas.NetworkSchema,
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

const txParamSchema = z.object({ hash: z.string() });

const txQuerySchema = z.object({
  network: schemas.NetworkSchema
});

export function transactionsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/transactions',
    {
      schema: {
        tags: ['Transactions'],
        querystring: txsQuerySchema,
        response: {
          200: schemas.TransactionsResponseSchema
        }
      }
    },
    async (request, _reply) => {
      const { network, limit, offset } = txsQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const txsRes: TransactionsResponse = await listTransactions(
        BigInt(limit),
        BigInt(offset),
        config
      );

      return txsRes;
    }
  );

  // TODO: just fetch the latest txs with the offset stuff
  server.get(
    '/transactions/latest',
    {
      schema: {
        tags: ['Transactions'],
        querystring: z.object({
          network: schemas.NetworkSchema
        }),
        response: {
          200: z.array(schemas.TransactionSchema)
        }
      }
    },
    async (_request, _reply) => {
      return [];
    }
  );

  server.get(
    '/transactions/:hash',
    {
      schema: {
        tags: ['Transactions'],
        params: txParamSchema,
        querystring: txQuerySchema,
        response: {
          200: schemas.TransactionSchema
        }
      }
    },
    async (request, _reply) => {
      const { hash } = txParamSchema.parse(request.params);
      const { network } = txQuerySchema.parse(request.query);
      const config = getNetworkConfig(app, network);

      const tx: Transaction = await resolveTx(Hash(hash), config);

      return tx;
    }
  );
}
