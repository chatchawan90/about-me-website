import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tee-lakkhananukun.pages.dev',
  server: { host: '127.0.0.1', port: 4321 },
  vite: { server: { strictPort: true } },
  build: {
    // Inline CSS so every page is self-contained and fast
    inlineStylesheets: 'always',
  },
});
