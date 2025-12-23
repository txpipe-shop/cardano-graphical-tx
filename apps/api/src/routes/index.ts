import type { FastifyInstance } from 'fastify';
import { tipRoutes } from './tip';
import { txRoutes } from './tx';

export function registerRoutes(fastify: FastifyInstance) {
    // Register route modules
    fastify.register(tipRoutes, { prefix: '/api' });
    fastify.register(txRoutes, { prefix: '/api' });
}
