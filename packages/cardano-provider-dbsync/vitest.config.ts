import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 180000,
    hookTimeout: 180000,
    setupFiles: ['./test/setup.ts']
  }
});
