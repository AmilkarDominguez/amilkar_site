// Astro 6 content collections — loader-based API
// Ref: https://docs.astro.build/en/guides/upgrade-to/v6/#removed-legacy-content-collections
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
