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
      '@alexandria/utxorpc-sdk/transport': isSsrBuild
        ? '@alexandria/utxorpc-sdk/transport/node'
        : '@alexandria/utxorpc-sdk/transport/web'
    }
  },
  define: {
    'process.env': {}
  }
}));
