import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fs from 'fs';
import path from 'path';
import { ZodError } from 'zod';
import { routes } from './routes';

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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

    await app.register(routes);

    app.setErrorHandler((error, request, reply) => {
      if (error instanceof ZodError) {
        reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation error',
          details: error.issues
        });
        return;
      }
      reply.send(error);
    });

    app.get('/health', async () => {
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

start();
