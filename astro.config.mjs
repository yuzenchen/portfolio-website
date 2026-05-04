import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yuzen.life',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
