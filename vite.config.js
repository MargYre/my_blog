import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ['svelte-routing']
  },
  // Pour éviter les problèmes de compatibilité ESM/CJS
  build: {
    target: 'esnext'
  }
});