import { FastifyInstance } from 'fastify';
import { Pool } from 'pg';
import { env } from './env';

export interface NetworkConfig {
    pool: Pool;
    magic: number;
    nodeUrl: string;
    addressPrefix: string;
}

export function getNetworkConfig(app: FastifyInstance, network?: string): NetworkConfig {
    const pools = app.pools;

    if (network === 'vector') {
        if (!pools['vector']) throw new Error('Vector pool not initialized');
        return {
            pool: pools['vector'],
            magic: env.MAGIC_VECTOR,
            nodeUrl: env.NODE_URL_VECTOR,
            addressPrefix: 'addr'
        };
    }

    if (network === 'prime-testnet') {
        if (!pools['prime-testnet']) throw new Error('Prime Testnet pool not initialized');
        return {
            pool: pools['prime-testnet'],
            magic: env.MAGIC_PRIME_TESTNET,
            nodeUrl: env.NODE_URL_PRIME_TESTNET,
            addressPrefix: 'addr_test'
        };
    }

    if (network === 'vector-testnet') {
        if (!pools['vector-testnet']) throw new Error('Vector Testnet pool not initialized');
        return {
            pool: pools['vector-testnet'],
            magic: env.MAGIC_VECTOR_TESTNET,
            nodeUrl: env.NODE_URL_VECTOR_TESTNET,
            addressPrefix: 'addr'
        };
    }

    if (network === 'prime') {
        if (!pools['prime']) throw new Error('Prime pool not initialized');
        return {
            pool: pools['prime'],
            magic: env.MAGIC_PRIME,
            nodeUrl: env.NODE_URL_PRIME,
            addressPrefix: 'addr'
        };
    }

    throw new Error(`Network configuration not found for: ${network}`);
}

export function getPool(app: FastifyInstance, network?: string): Pool {
    return getNetworkConfig(app, network).pool;
}
