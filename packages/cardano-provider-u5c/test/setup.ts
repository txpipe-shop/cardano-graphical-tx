import 'dotenv/config';
import z from 'zod';

export const testEnv = z.object({
  U5C_URL: z.string(),
  BF_URL: z.string(), // Blockfrost URL for the network U5C is running on
  BF_PID: z.string().optional() // Blockfrost Project ID if needed
});

export type TestEnv = z.infer<typeof testEnv>;
