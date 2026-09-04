import { defineConfig } from 'astro/config';

// The site lives at the root of a custom domain, so that is the default.
// Both stay overridable per build — the Docker smoke-test image sets its own.
const base = process.env.BASE_PATH ?? '/';
const site = process.env.SITE ?? 'https://yuzen.tw';

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
