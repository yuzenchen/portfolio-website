import { defineConfig } from 'astro/config';

// BASE_PATH lets us switch between "/" (custom domain, local Docker test)
// and "/portfolio-website" (GitHub Pages project site) without touching config.
const base = process.env.BASE_PATH ?? '/portfolio-website';

// SITE follows the same logic — override with SITE env at build time when
// you move to a custom domain (e.g. SITE=https://yuzen.life).
const site = process.env.SITE ?? 'https://yuzenchen.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
