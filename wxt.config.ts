import { defineConfig, WxtViteConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-solid'],
  vite: () => ({
    plugins: [tailwindcss()],
  }) as WxtViteConfig,
});
