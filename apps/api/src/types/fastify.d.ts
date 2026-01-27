import TimeAgo from 'javascript-time-ago';
import { Pool } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    pools: Record<string, Pool>;
    timeAgo: TimeAgo;
  }
}
