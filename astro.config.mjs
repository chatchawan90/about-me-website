import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tee-lakkhananukun.pages.dev',
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/404') })],
  server: { host: '127.0.0.1', port: 4321 },
  vite: { server: { strictPort: true } },
  build: {
    // Inline CSS so every page is self-contained and fast
    inlineStylesheets: 'always',
  },
});
