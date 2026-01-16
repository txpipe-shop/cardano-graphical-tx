import TimeAgo from 'javascript-time-ago';
import { Pool } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    pg: Pool;
    timeAgo: TimeAgo;
  }
}
