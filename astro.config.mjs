// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://amilkardominguez.com',
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    resolve: {
      alias: {
        '~': join(__dirname, 'src'),
      },
    },
  },
});
