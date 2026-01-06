import { z } from 'zod';
import { registry } from '../openapi.js';

export const NetworkSchema = z
  .enum(['prime', 'vector', 'nexus'])
  .describe('Network identifier')
  .openapi({ example: 'prime' });

export const LimitSchema = z
  .number()
  .int()
  .min(1)
  .max(100)
  .default(20)
  .describe('Number of items per page')
  .openapi({ example: 20 });

export const OffsetSchema = z
  .number()
  .int()
  .min(0)
  .default(0)
  .describe('Number of items to skip')
  .openapi({ example: 0 });

const ErrorSchema = registry.register(
  'Error',
  z.object({
    error: z.string(),
    message: z.string()
  })
);

export const BadRequestSchema = registry.registerComponent('responses', 'BadRequest', {
  description: 'Bad Request',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' }
    }
  }
});

export const NotFoundSchema = registry.registerComponent('responses', 'NotFound', {
  description: 'Not Found',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' }
    }
  }
});

export const InternalServerErrorSchema = registry.registerComponent(
  'responses',
  'InternalServerError',
  {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Error' }
      }
    }
  }
);
