import { defineConfig } from 'astro/config';

// The site lives at the root of a custom domain, so that is the default.
// Both are still overridable per build — a GitHub Pages *project* site would
// need BASE_PATH=/portfolio-website, for instance.
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
