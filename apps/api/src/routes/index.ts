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
  await app.register(blocksRoutes);
  await app.register(transactionsRoutes);
  await app.register(addressesRoutes);
  await app.register(statsRoutes);
  await app.register(tokensRoutes);
  await app.register(epochsRoutes);
  await app.register(poolsRoutes);
  await app.register(contractsRoutes);
  await app.register(gasRoutes);
  await app.register(utilityRoutes);
}
