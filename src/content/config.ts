import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    placeholderTitle: z.string(),
    icon: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    demo: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number(),
  }),
});

export const collections = { portfolio };
