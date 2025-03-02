import { defineConfig, WxtViteConfig } from 'wxt';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-solid'],
  alias: {
    '$': path.resolve(__dirname, 'entrypoints/content'),
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }) as WxtViteConfig,
});
