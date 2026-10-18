import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { rehypeBasePaths } from './src/utils/rehypeBasePaths.mjs';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://gatasconspicuity.github.io/gatasDoc/',
  base: isGitHubPages ? '/gatasDoc//' : '/',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeBasePaths],
    }),
  },
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
  build: {
    format: 'directory',
  },
});
