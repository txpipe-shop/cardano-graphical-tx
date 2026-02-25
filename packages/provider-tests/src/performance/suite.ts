import { describe, it, expect } from 'vitest';
import { ChainProvider } from '@laceanatomy/provider-core';
import { cardano } from '@laceanatomy/types';

export type PerformanceSuiteOptions = {
  providerName: string;
  createProvider: () => Promise<ChainProvider<cardano.UTxO, cardano.Tx, any>>;
  scenarios: {
    name: string;
    run: (provider: ChainProvider<cardano.UTxO, cardano.Tx, any>) => Promise<void>;
  }[];
  options?: {
    concurrency?: number;
    duration?: number; // ms
    warmup?: number; // ms
  };
  cleanup?: (provider: ChainProvider<cardano.UTxO, cardano.Tx, any>) => Promise<void>;
};

export function definePerformanceSuite(options: PerformanceSuiteOptions) {
  const { providerName, createProvider, scenarios, cleanup } = options;
  const config = {
    concurrency: options.options?.concurrency ?? 10,
    duration: options.options?.duration ?? 10000,
    warmup: options.options?.warmup ?? 2000
  };

  describe(`Performance Tests: ${providerName}`, () => {
    for (const scenario of scenarios) {
      it(
        `Benchmark: ${scenario.name}`,
        { timeout: config.duration + config.warmup + 60000 }, // Extra 60s buffer for slow DB queries
        async () => {
          // Create a pool of providers for concurrency simulation
          // Ideally we might want one provider instance or multiple depending on what we track.
          // Usually providers are stateless or singletons, so one instance is often enough.
          // Unless we specifically want to test connection pooling.
          // We'll stick to one provider for now, assuming it handles concurrent calls.
          const provider = await createProvider();

          try {
            console.log(`Starting warmup for ${scenario.name}...`);
            const warmupEnd = Date.now() + config.warmup;
            while (Date.now() < warmupEnd) {
              await scenario.run(provider).catch(() => {});
            }

            console.log(
              `Starting benchmark for ${scenario.name} (Duration: ${config.duration}ms, Concurrency: ${config.concurrency})...`
            );

            const stats = {
              success: 0,
              error: 0,
              latencies: [] as number[]
            };

            const start = Date.now();
            const end = start + config.duration;

            const worker = async () => {
              while (Date.now() < end) {
                const reqStart = Date.now();
                try {
                  await scenario.run(provider);
                  stats.success++;
                  stats.latencies.push(Date.now() - reqStart);
                } catch (e) {
                  stats.error++;
                }
              }
            };

            await Promise.all(Array(config.concurrency).fill(null).map(worker));

            const totalTime = Date.now() - start;
            const totalReqs = stats.success + stats.error;
            const rps = (totalReqs / (totalTime / 1000)).toFixed(2);
            stats.latencies.sort((a, b) => a - b);
            const p95 = stats.latencies[Math.floor(stats.latencies.length * 0.95)] || 0;
            const p99 = stats.latencies[Math.floor(stats.latencies.length * 0.99)] || 0;
            const avg = stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length || 0;

            console.log(`\nResults for ${scenario.name}:`);
            console.log(`  Total Requests: ${totalReqs}`);
            console.log(`  Success: ${stats.success}`);
            console.log(`  Error: ${stats.error}`);
            console.log(`  RPS: ${rps}`);
            console.log(`  Avg Latency: ${avg.toFixed(2)}ms`);
            console.log(`  P95 Latency: ${p95}ms`);
            console.log(`  P99 Latency: ${p99}ms\n`);

            expect(stats.success).toBeGreaterThan(0);
          } finally {
            if (cleanup) await cleanup(provider);
          }
        }
      );
    }
  });
}
