import { defineConfig, WxtViteConfig } from 'wxt';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
  alias: {
    '$': path.resolve(__dirname, 'entrypoints/content'),
  },
  manifest: {
    name: 'Momments',
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }) as WxtViteConfig,
});
