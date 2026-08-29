import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    /** Uppercase badge shown on the card thumbnail, e.g. "E-COMMERCE". */
    category: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()),
    /** Live demo URL. Takes priority over `repo` for the card's link. */
    demo: z.string().url().optional(),
    /** Shown as the card link when there's no public demo. */
    repo: z.string().url().optional(),
    /** Path under public/ for the card thumbnail; falls back to a placeholder. */
    image: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { portfolio };
