import dotenv from 'dotenv';
import { z, ZodError } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  // Prime Network
  DATABASE_URL_PRIME: z.string().min(1, 'DATABASE_URL_PRIME must be a non-empty string'),
  MAGIC_PRIME: z.coerce.number(),
  NODE_URL_PRIME: z.string().min(1, 'NODE_URL_PRIME must be a non-empty string'),
  TOKEN_REGISTRY_URL_PRIME: z
    .string()
    .default('https://tokens.cardano.org/metadata')
    .describe('Token Registry URL for Prime'),

  // Prime Testnet
  DATABASE_URL_PRIME_TESTNET: z
    .string()
    .min(1, 'DATABASE_URL_PRIME_TESTNET must be a non-empty string'),
  MAGIC_PRIME_TESTNET: z.coerce.number(),
  NODE_URL_PRIME_TESTNET: z.string().min(1, 'NODE_URL_PRIME_TESTNET must be a non-empty string'),
  TOKEN_REGISTRY_URL_PRIME_TESTNET: z
    .string()
    .default('https://tokens.cardano.org/metadata')
    .describe('Token Registry URL for Prime Testnet'),

  // Vector Network
  DATABASE_URL_VECTOR: z.string().min(1, 'DATABASE_URL_VECTOR must be a non-empty string'),
  MAGIC_VECTOR: z.coerce.number(),
  NODE_URL_VECTOR: z.string().min(1, 'NODE_URL_VECTOR must be a non-empty string'),
  TOKEN_REGISTRY_URL_VECTOR: z
    .string()
    .default('https://tokens.cardano.org/metadata')
    .describe('Token Registry URL for Vector'),

  // Vector Testnet
  DATABASE_URL_VECTOR_TESTNET: z
    .string()
    .min(1, 'DATABASE_URL_VECTOR_TESTNET must be a non-empty string'),
  MAGIC_VECTOR_TESTNET: z.coerce.number(),
  NODE_URL_VECTOR_TESTNET: z.string().min(1, 'NODE_URL_VECTOR_TESTNET must be a non-empty string'),
  TOKEN_REGISTRY_URL_VECTOR_TESTNET: z
    .string()
    .default('https://tokens.cardano.org/metadata')
    .describe('Token Registry URL for Vector Testnet')
});

type Env = z.infer<typeof EnvSchema>;

let parsed: Env;
try {
  parsed = EnvSchema.parse(process.env);
} catch (err) {
  if (err instanceof ZodError) {
    console.error('Environment validation error:');
    for (const issue of err.issues) {
      console.error(`- ${issue.path.join('.')} : ${issue.message}`);
    }
  } else {
    console.error('Unknown environment validation error', err);
  }
  process.exit(1);
}

export const env = parsed;
