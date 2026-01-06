import type { FastifyInstance } from 'fastify';
import { blocksRoutes } from './blocks.js';
import { transactionsRoutes } from './transactions.js';
import { addressRoutes } from './addresses.js';
import { statsRoutes } from './stats.js';
import { tokensRoutes } from './tokens.js';
import { epochsRoutes } from './epochs.js';
import { poolsRoutes } from './pools.js';
import { contractsRoutes } from './contracts.js';
import { gasRoutes } from './gas.js';
import { utilityRoutes } from './utility.js';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(blocksRoutes);
  fastify.register(transactionsRoutes);
  fastify.register(addressRoutes);
  fastify.register(statsRoutes);
  fastify.register(tokensRoutes);
  fastify.register(epochsRoutes);
  fastify.register(poolsRoutes);
  fastify.register(contractsRoutes);
  fastify.register(gasRoutes);
  fastify.register(utilityRoutes);
}
