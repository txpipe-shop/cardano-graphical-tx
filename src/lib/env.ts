import { z } from 'zod';

const publicEnvSchema = z.object({
  PUBLIC_NETWORK: z.string()
});

const parsed = publicEnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid PUBLIC env vars:', z.treeifyError(parsed.error));
  throw new Error('Invalid PUBLIC environment variables');
}

export const publicEnv = parsed.data;
