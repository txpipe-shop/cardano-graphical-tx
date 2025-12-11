import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [tailwindcss(), sveltekit(), wasm()],
  ssr: {
    noExternal: ['bits-ui']
  },
  resolve: {
    alias: {
      '@sdk/grpcTransport': isSsrBuild
        ? '/src/lib/sdk/utxorpc/grpcTransport.node.ts'
        : '/src/lib/sdk/utxorpc/grpcTransport.web.ts'
    }
  },
  define: {
    'process.env': {}
  }
}));
