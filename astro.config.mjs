import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tee-lakkhananukun.agentic516597.chatgpt.site',
  build: {
    // Inline CSS so every page is self-contained and fast
    inlineStylesheets: 'always',
  },
});
