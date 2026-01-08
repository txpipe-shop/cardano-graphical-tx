import dotenv from 'dotenv';
import { z, ZodError } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .optional()
    .refine((v) => v === undefined || v.length > 0, {
      message: 'DATABASE_URL must be a non-empty string when provided'
    }),
  PG_HOST: z.string().optional().default('localhost'),
  PG_PORT: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().int().positive().default(5432)
  ),
  PG_USER: z.string().default('postgres'),
  PG_PASSWORD: z.string().optional(),
  PG_DATABASE: z.string().default('postgres'),
  PG_MAX: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().int().positive().default(10)
  ),
  PG_SSL: z.preprocess((v) => {
    if (v === undefined) return false;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    return Boolean(v);
  }, z.boolean().default(false))
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
