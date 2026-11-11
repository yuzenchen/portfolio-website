import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    /** Uppercase badge shown on the card thumbnail, e.g. "E-COMMERCE". */
    category: z.string().optional(),
    description: z.string(),
    /** How the work was done by hand before the project. When both `before`
     *  and `after` are set, the card shows them as a 原本 / 現在 pair in
     *  place of `description`. */
    before: z.string().optional(),
    /** What the project changed it to; pairs with `before`. */
    after: z.string().optional(),
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
