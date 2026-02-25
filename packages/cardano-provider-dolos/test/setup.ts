import 'dotenv/config';
import z from 'zod';

export const testEnv = z.object({
  UTXORPC_URL: z.string().url(),
  MINIBF_URL: z.string().url(),
  BF_URL: z.string().url(),
  BF_PID: z.string().optional()
});

export type TestEnv = z.infer<typeof testEnv>;
