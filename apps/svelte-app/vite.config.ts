import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [tailwindcss(), sveltekit(), wasm()],
  ssr: {
    noExternal: ['bits-ui']
  },
  build: {
    rollupOptions: {
      // Externalize Node.js-only packages from client bundle
      external: isSsrBuild
        ? []
        : ['@connectrpc/connect-node', '@emurgo/cardano-serialization-lib-nodejs']
    }
  },
  define: {
    'process.env': {}
  }
}));
