import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import path from 'path';
import { ZodError } from 'zod';
import { routes } from './routes';
import { Pool } from 'pg';
import { env } from './env';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  },
  maxParamLength: 256
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// TODO: add multiple network support (multiple pools per each one, each with its own prefix). Monolith. Otherwise to allow individual scaling, each instance can handle a single network -> At this point it's overengineering

const start = async () => {
  try {
    const openApiParams = {
      mode: 'static' as const,
      specification: {
        path: path.join(__dirname, '../openapi.yaml'),
        baseDir: path.join(__dirname, '..')
      }
    };

    await app.register(cors);

    await app.register(swagger, openApiParams);

    await app.register(swaggerUi, {
      routePrefix: '/documentation'
    });

    const pgConfig = env.DATABASE_URL
      ? { connectionString: env.DATABASE_URL }
      : {
          host: env.PG_HOST,
          port: env.PG_PORT,
          user: env.PG_USER,
          password: env.PG_PASSWORD,
          database: env.PG_DATABASE,
          max: env.PG_MAX,
          ssl: env.PG_SSL ? { rejectUnauthorized: false } : undefined
        };

    const pool = new Pool(pgConfig);

    const timeAgo = new TimeAgo('en-US');
    app.decorate('pg', pool);
    app.decorate('timeAgo', timeAgo);
    app.addHook('onClose', async (instance) => {
      try {
        await instance.pg.end();
      } catch (e) {
        app.log.warn('Error closing pg pool: %s', String(e));
      }
    });

    await app.register(routes);

    app.setErrorHandler(async (error, _request, reply) => {
      if (error instanceof ZodError) {
        await reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation error',
          details: error.issues
        });
        return;
      }
      await reply.send(error);
    });

    app.get('/health', () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    await app.ready();
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on http://0.0.0.0:3000');
    console.log('Documentation available at http://0.0.0.0:3000/documentation');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start()
  .then(() => console.log('Server started correctly'))
  .catch((err) => console.log('Error starting server', err));
