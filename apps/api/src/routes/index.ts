import { FastifyInstance } from 'fastify';
import { blocksRoutes } from './blocks';
import { transactionsRoutes } from './transactions';
import { addressesRoutes } from './addresses';
import { statsRoutes } from './stats';
import { tokensRoutes } from './tokens';
import { epochsRoutes } from './epochs';
import { poolsRoutes } from './pools';
import { contractsRoutes } from './contracts';
import { gasRoutes } from './gas';
import { utilityRoutes } from './utility';

export async function routes(app: FastifyInstance) {
  app.register(blocksRoutes);
  app.register(transactionsRoutes);
  app.register(addressesRoutes);
  app.register(statsRoutes);
  app.register(tokensRoutes);
  app.register(epochsRoutes);
  app.register(poolsRoutes);
  app.register(contractsRoutes);
  app.register(gasRoutes);
  app.register(utilityRoutes);
}
